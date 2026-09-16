/**
 * SmartBus Tracking Service Abstraction Layer
 * ---------------------------------------------------------------------
 * Provides a unified, pluggable interface for live bus telemetry:
 * 1. Smooth Waypoint Interpolation Engine (prevents sudden coordinate jumps)
 * 2. Real-Time Dynamic Distance & Stops Remaining Calculations
 * 3. Smart Stop Alert & Proximity Trigger Engine
 * 4. Pluggable Data Provider (Simulation Mode <-> Real GPS / Firebase / Supabase / WebSocket)
 * 5. In-memory caching integration via cacheService
 */

import { memoryCache } from './cacheService';
import { 
  INITIAL_BUSES, 
  INITIAL_ROUTES, 
  INITIAL_STOPS, 
  calculateTrafficAdjustedEta,
  getCrowdLevel,
  getSmartPassengerSuggestion
} from './transitData';

/**
 * Calculates Euclidean distance between two 2D points on the map grid
 */
export function calculatePointDistance(p1, p2) {
  if (!p1 || !p2) return 0;
  const dx = (p2.x ?? 0) - (p1.x ?? 0);
  const dy = (p2.y ?? 0) - (p1.y ?? 0);
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculates total path distance across an array of waypoints
 */
export function calculatePathDistance(waypoints) {
  if (!Array.isArray(waypoints) || waypoints.length < 2) return 0;
  let total = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    total += calculatePointDistance(waypoints[i], waypoints[i + 1]);
  }
  return total;
}

/**
 * Converts map pixel distance to approximate real-world kilometers
 * Calibration: 100 map units ≈ 3.5 km
 */
export function mapUnitsToKm(units) {
  return Number((units * 0.035).toFixed(1));
}

class TrackingService {
  constructor() {
    this.dataSource = 'SIMULATION'; // 'SIMULATION' | 'REAL_GPS' | 'FIREBASE'
    this.buses = JSON.parse(JSON.stringify(INITIAL_BUSES));
    this.routes = JSON.parse(JSON.stringify(INITIAL_ROUTES));
    this.stops = JSON.parse(JSON.stringify(INITIAL_STOPS));

    // Internal animation & interpolation state
    // Map of busId -> { currentWaypointIdx, targetWaypointIdx, progress: 0..1, speedFactor }
    this.interpolationState = new Map();
    this.listeners = new Set();
    this.alertListeners = new Set();
    this.activeAlertSubscriptions = new Map(); // busId -> { stopId, triggered }

    this.timerId = null;
    this.lastTickTime = Date.now();
    this.initializeInterpolation();
  }

  /**
   * Initializes starting interpolation positions for all active buses
   */
  initializeInterpolation() {
    this.buses.forEach((bus) => {
      const waypoints = bus.waypoints || [{ x: bus.coordinates.x, y: bus.coordinates.y }];
      const idx = bus.waypointIndex ?? 0;
      const targetIdx = (idx + 1) % waypoints.length;

      this.interpolationState.set(bus.id, {
        currentWaypointIdx: idx,
        targetWaypointIdx: targetIdx,
        progress: 0.15, // start partially along the segment
        speedFactor: 0.045 + (Math.random() * 0.02) // smooth step increment per tick
      });
    });
  }

  /**
   * Starts the high-frequency smooth simulation ticker
   * Ticks every 400ms with subtle sub-step interpolation for buttery smooth movement
   */
  startSimulation() {
    if (this.timerId) return;

    this.lastTickTime = Date.now();
    this.timerId = setInterval(() => {
      this.tickSimulation();
    }, 400);
  }

  stopSimulation() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  /**
   * Core simulation tick: advances bus positions gradually between waypoints
   */
  tickSimulation() {
    if (this.dataSource !== 'SIMULATION') return;

    let hasChanges = false;

    this.buses = this.buses.map((bus) => {
      if (bus.status === 'Out of Service' || !bus.waypoints || bus.waypoints.length <= 1) {
        return bus;
      }

      const state = this.interpolationState.get(bus.id) || {
        currentWaypointIdx: 0,
        targetWaypointIdx: 1,
        progress: 0,
        speedFactor: 0.05
      };

      // Speed variation factor based on bus speed
      const baseIncrement = (bus.speedKmH || 40) / 40 * 0.04;
      state.progress += baseIncrement;

      const currWaypoint = bus.waypoints[state.currentWaypointIdx];
      let targetWaypoint = bus.waypoints[state.targetWaypointIdx];

      // Reached next waypoint
      let stopTransition = false;
      if (state.progress >= 1) {
        state.progress = 0;
        state.currentWaypointIdx = state.targetWaypointIdx;
        state.targetWaypointIdx = (state.targetWaypointIdx + 1) % bus.waypoints.length;
        targetWaypoint = bus.waypoints[state.targetWaypointIdx];
        stopTransition = true;
      }

      // Smooth linear interpolation (lerp)
      const t = Math.min(Math.max(state.progress, 0), 1);
      const newX = currWaypoint.x + (targetWaypoint.x - currWaypoint.x) * t;
      const newY = currWaypoint.y + (targetWaypoint.y - currWaypoint.y) * t;

      // Heading calculation in degrees
      const dx = targetWaypoint.x - currWaypoint.x;
      const dy = targetWaypoint.y - currWaypoint.y;
      const heading = Math.round((Math.atan2(dy, dx) * 180) / Math.PI + 90);

      // Speed with realistic subtle oscillation
      const speedJitter = Math.floor(Math.random() * 3) - 1;
      const newSpeed = Math.max(22, Math.min(58, bus.speedKmH + speedJitter));

      // Dynamically locate nearest stop and next stop along route
      const { currentStopName, nextStopName, distanceRemainingKm, stopsRemaining } = 
        this.computeRouteProgress(bus, { x: newX, y: newY }, state.targetWaypointIdx);

      // Check Smart Stop Alerts for registered passengers
      this.checkStopAlerts(bus.id, { x: newX, y: newY }, nextStopName, distanceRemainingKm);

      // Dynamic Stop-Driven Passenger & Seat Simulation:
      // Passenger flow occurs when arriving/transitioning at stops, preserving stable metrics between stops.
      const totalSeats = bus.totalSeats || 45;
      const standingCap = bus.standingCapacity || 15;
      const totalCap = bus.totalCapacity || (totalSeats + standingCap);

      let availableSeats = bus.availableSeats ?? 18;
      let standingPassengers = bus.standingPassengers ?? 4;
      let occupancyPercent = bus.occupancyPercent ?? 65;
      let crowdLevel = bus.crowdLevel || getCrowdLevel(occupancyPercent);

      if (stopTransition) {
        const currentTotal = (totalSeats - availableSeats) + standingPassengers;
        // Realistic passenger exchange: alighting and boarding delta between -4 and +4
        const flowDelta = Math.floor(Math.random() * 9) - 4;
        const newTotalPassengers = Math.max(8, Math.min(totalCap, currentTotal + flowDelta));
        
        const seated = Math.min(totalSeats, newTotalPassengers);
        availableSeats = Math.max(0, totalSeats - seated);
        standingPassengers = Math.max(0, newTotalPassengers - totalSeats);
        occupancyPercent = Math.round((newTotalPassengers / totalCap) * 100);
        crowdLevel = getCrowdLevel(occupancyPercent);
      }

      hasChanges = true;

      return {
        ...bus,
        coordinates: { x: Number(newX.toFixed(2)), y: Number(newY.toFixed(2)) },
        headingDeg: heading,
        waypointIndex: state.currentWaypointIdx,
        speedKmH: newSpeed,
        currentStop: currentStopName || bus.currentStop,
        nextStop: nextStopName || bus.nextStop,
        distanceRemainingKm,
        stopsRemaining,
        availableSeats,
        standingPassengers,
        occupancyPercent,
        crowdLevel,
        lastUpdated: 'Just now'
      };
    });

    if (hasChanges) {
      this.notifyListeners();
    }
  }

  /**
   * Computes current stop, next stop, distance remaining, and stops remaining along route
   */
  computeRouteProgress(bus, currentCoords, targetWaypointIdx) {
    const route = this.routes.find((r) => r.id === bus.routeId || r.number === bus.number);
    const stopsForRoute = route 
      ? route.stops.map(sName => this.stops.find(st => st.name.toLowerCase().includes(sName.toLowerCase()) || sName.toLowerCase().includes(st.name.toLowerCase()))).filter(Boolean)
      : this.stops;

    // Find closest stop to current position
    let closestStop = stopsForRoute[0] || this.stops[0];
    let minDistance = Infinity;

    stopsForRoute.forEach(stop => {
      const d = calculatePointDistance(currentCoords, { x: stop.mapX, y: stop.mapY });
      if (d < minDistance) {
        minDistance = d;
        closestStop = stop;
      }
    });

    // Identify next stop in sequence
    const currentStopIdx = stopsForRoute.findIndex(s => s.id === closestStop?.id);
    const nextStop = stopsForRoute[(currentStopIdx + 1) % stopsForRoute.length] || stopsForRoute[0];

    // Compute remaining stops to the terminal destination
    const totalStops = stopsForRoute.length;
    const remainingStopsCount = Math.max(1, totalStops - 1 - (currentStopIdx >= 0 ? currentStopIdx : 0));

    // Distance remaining to terminal
    const terminalStop = stopsForRoute[stopsForRoute.length - 1] || closestStop;
    const directDistanceUnits = calculatePointDistance(currentCoords, { x: terminalStop.mapX, y: terminalStop.mapY });
    const distanceKm = Math.max(0.4, mapUnitsToKm(directDistanceUnits));

    return {
      currentStopName: closestStop?.name?.split(' (')[0] || 'Transit Point',
      nextStopName: nextStop?.name?.split(' (')[0] || 'Next Station',
      distanceRemainingKm: distanceKm,
      stopsRemaining: remainingStopsCount
    };
  }

  /**
   * Checks if bus is approaching user-selected destination stop
   */
  checkStopAlerts(busId, currentCoords, nextStopName, distanceRemainingKm) {
    const alertSub = this.activeAlertSubscriptions.get(busId);
    if (!alertSub || alertSub.triggered) return;

    const targetStop = this.stops.find(s => s.id === alertSub.stopId);
    if (!targetStop) return;

    const distUnits = calculatePointDistance(currentCoords, { x: targetStop.mapX, y: targetStop.mapY });
    const distKm = mapUnitsToKm(distUnits);

    // Trigger alert when within 48 map units (~1.6 km) or next stop matches
    const isNextStop = nextStopName && targetStop.name.toLowerCase().includes(nextStopName.toLowerCase());
    const isProximityClose = distKm <= 1.6 || distUnits <= 48;

    if (isNextStop || isProximityClose) {
      alertSub.triggered = true;
      this.triggerAlert({
        busId,
        stopId: targetStop.id,
        stopName: targetStop.name,
        distanceKm: distKm,
        message: `Your stop is approaching! Get ready to exit at ${targetStop.name.split(' (')[0]}.`,
        timestamp: Date.now()
      });
    }
  }

  /**
   * Sets passenger's destination stop for smart proximity alerts
   */
  setDestinationAlert(busId, stopId) {
    if (!stopId) {
      this.activeAlertSubscriptions.delete(busId);
      return false;
    }

    this.activeAlertSubscriptions.set(busId, {
      stopId,
      triggered: false,
      setAt: Date.now()
    });

    return true;
  }

  clearDestinationAlert(busId) {
    this.activeAlertSubscriptions.delete(busId);
  }

  getDestinationAlert(busId) {
    return this.activeAlertSubscriptions.get(busId) || null;
  }

  triggerAlert(alertData) {
    this.alertListeners.forEach((listener) => {
      try {
        listener(alertData);
      } catch (err) {
        console.error('Error in alert listener:', err);
      }
    });
  }

  /**
   * Subscribe to live fleet telemetry
   */
  subscribe(listener) {
    this.listeners.add(listener);
    // Send initial snapshot immediately
    listener(this.buses);
    return () => this.listeners.delete(listener);
  }

  /**
   * Subscribe to smart stop alerts
   */
  subscribeAlerts(listener) {
    this.alertListeners.add(listener);
    return () => this.alertListeners.delete(listener);
  }

  notifyListeners() {
    this.listeners.forEach((listener) => {
      try {
        listener(this.buses);
      } catch (err) {
        console.error('Error in tracking subscriber:', err);
      }
    });
  }

  // --- Read Methods ---

  getBuses() {
    return this.buses;
  }

  getBusById(id) {
    return this.buses.find(b => b.id === id) || null;
  }

  getRoutes() {
    return this.routes;
  }

  getRouteById(id) {
    return this.routes.find(r => r.id === id) || null;
  }

  getStops() {
    return this.stops;
  }

  getStopById(id) {
    return this.stops.find(s => s.id === id) || null;
  }

  /**
   * Switches data source between Simulation and Future Real GPS (Firebase/Supabase)
   */
  setDataSource(source) {
    this.dataSource = source;
    if (source === 'SIMULATION') {
      this.startSimulation();
    } else {
      this.stopSimulation();
      // Future Real GPS connection hooks:
      // e.g. Firebase Realtime Database: ref('telemetry/fleet').on('value', ...)
      // or Supabase channel: supabase.channel('realtime:buses').on(...)
    }
  }

  getDataSource() {
    return this.dataSource;
  }
}

export const trackingService = new TrackingService();
// Auto-start simulation engine
trackingService.startSimulation();
export default trackingService;
