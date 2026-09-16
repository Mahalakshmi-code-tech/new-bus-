/**
 * SmartBus Notification & Transit Alert Intelligence Service
 * ---------------------------------------------------------------------
 * Evaluates simulated transit telemetry (ETAs, delays, occupancy, stops, routes)
 * and generates context-aware transit notifications with robust deduplication.
 * 
 * IMPORTANT:
 * SmartBus runs on simulated transit telemetry. All notifications reflect simulated
 * schedule headway, simulated corridor traffic, and dynamic mock passenger flow.
 */

// In-memory registry for event deduplication: eventKey -> timestamp (ms)
const recentEventLog = new Map();

// Cooldown windows to prevent alert spamming (in milliseconds)
const COOLDOWNS = {
  approaching: 4 * 60 * 1000,    // 4 minutes per bus & stop
  delayed: 6 * 60 * 1000,        // 6 minutes per delayed corridor
  crowd: 5 * 60 * 1000,          // 5 minutes per crowd threshold
  stop_alert: 8 * 60 * 1000,     // 8 minutes per destination stop
  route_update: 10 * 60 * 1000,  // 10 minutes per route update
  favorite: 5 * 60 * 1000        // 5 minutes per favorite event
};

/**
 * Clean up old keys from the deduplication map to prevent memory leaks
 */
function pruneEventLog() {
  const now = Date.now();
  const maxRetention = 30 * 60 * 1000; // 30 minutes
  for (const [key, timestamp] of recentEventLog.entries()) {
    if (now - timestamp > maxRetention) {
      recentEventLog.delete(key);
    }
  }
}

/**
 * Checks whether an alert with this key has already been triggered within cooldown
 */
function shouldThrottle(eventKey, cooldownMs) {
  const lastTriggered = recentEventLog.get(eventKey);
  if (!lastTriggered) return false;
  return (Date.now() - lastTriggered) < cooldownMs;
}

/**
 * Registers an alert event trigger timestamp
 */
function recordTrigger(eventKey) {
  recentEventLog.set(eventKey, Date.now());
  if (recentEventLog.size > 150) {
    pruneEventLog();
  }
}

/**
 * Explains why a simulated transit alert was triggered (for AI Co-Pilot & UI cards)
 * @param {Object} notification 
 * @returns {string} Factual explanation based on simulated telemetry
 */
export function explainNotificationTrigger(notification) {
  if (!notification) {
    return 'This alert was generated based on SmartBus live simulated schedule headway.';
  }

  if (notification.simulatedReason) {
    return notification.simulatedReason;
  }

  const { type, busNumber, routeNumber, title, meta = {} } = notification;

  switch (type) {
    case 'approaching':
      return `${busNumber || 'The bus'} triggered this alert because its simulated timetable ETA reached ${meta.eta || '≤ 5'} minutes approaching ${meta.stopName || 'the scheduled stop'}.`;
    case 'delayed':
      return `${busNumber || 'The service'} triggered this alert because simulated corridor congestion added an estimated delay of ${meta.delayMinutes || 'several'} minutes.`;
    case 'crowd':
      return `${busNumber || 'The vehicle'} generated this alert because simulated passenger boarding reached high capacity (${meta.occupancy || '≥ 80%'} occupancy).`;
    case 'stop':
      return `Generated because simulated telemetry detected proximity within 1.5 km of your selected destination stop (${meta.stopName || 'Destination'}).`;
    case 'route_update':
      return `Route ${routeNumber || ''} generated this alert due to simulated corridor traffic status updates.`;
    case 'favorite':
      return `Generated because ${busNumber || routeNumber || 'this transit node'} is marked in your saved passenger favorites.`;
    default:
      return `Alert "${title}" was dispatched by the simulated transit monitoring engine.`;
  }
}

/**
 * Evaluates live simulated telemetry to generate any new pending notifications
 * 
 * @param {Object} telemetryState
 * @param {Array} telemetryState.buses
 * @param {Array} telemetryState.routes
 * @param {Array} telemetryState.stops
 * @param {Object} telemetryState.favorites
 * @param {string} telemetryState.selectedBusId
 * @param {string} telemetryState.destinationAlertStopId
 * @param {Array} telemetryState.existingNotifications
 * @returns {Array} Array of newly triggered notifications (may be empty)
 */
export function evaluateTransitAlerts({
  buses = [],
  routes = [],
  stops = [],
  favorites = { buses: [], routes: [], stops: [] },
  selectedBusId = null,
  destinationAlertStopId = null,
  existingNotifications = []
}) {
  const newAlerts = [];
  const existingKeys = new Set(
    existingNotifications
      .filter(n => n.eventKey)
      .map(n => n.eventKey)
  );

  // Helper to add unique alert
  const emitAlert = (alertData, cooldownMs) => {
    const { eventKey } = alertData;
    if (existingKeys.has(eventKey)) return;
    if (shouldThrottle(eventKey, cooldownMs)) return;

    recordTrigger(eventKey);
    newAlerts.push({
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: 'Just now',
      createdAt: Date.now(),
      read: false,
      ...alertData
    });
  };

  // 1. Evaluate Buses (Approaching, Delay, Crowd, Favorites)
  buses.forEach(bus => {
    if (bus.status === 'Out of Service') return;

    const isFav = favorites.buses?.includes(bus.id);
    const isSelected = bus.id === selectedBusId;
    const eta = bus.trafficAdjustedEtaMinutes ?? bus.normalEtaMinutes ?? 0;
    const delay = Math.max(0, (bus.trafficAdjustedEtaMinutes || 0) - (bus.normalEtaMinutes || 0));

    // A. Bus Approaching Alert (ETA <= 5 min and arriving at next stop)
    if (eta > 0 && eta <= 5 && bus.nextStop) {
      // Prioritize selected bus, favorites, or general approaching
      if (isSelected || isFav || eta <= 3) {
        const eventKey = `approaching_${bus.id}_${bus.nextStop}_${eta <= 2 ? 'imminent' : 'near'}`;
        emitAlert({
          eventKey,
          type: 'approaching',
          category: 'bus',
          title: `${bus.number} Approaching`,
          message: `Arriving at ${bus.nextStop} in approximately ${eta} minute${eta === 1 ? '' : 's'}.`,
          busId: bus.id,
          busNumber: bus.number,
          routeNumber: bus.number?.replace(/[^0-9A-Za-z]/g, ''),
          isFavorite: isFav,
          meta: {
            eta: `${eta} min`,
            stopName: bus.nextStop,
            occupancy: `${bus.occupancyPercent || 60}%`
          },
          simulatedReason: `Bus ${bus.number} generated this alert because its simulated timetable ETA reached ${eta} minutes for ${bus.nextStop}.`,
          action: {
            label: 'Track Bus',
            page: 'tracking',
            busId: bus.id
          }
        }, COOLDOWNS.approaching);
      }
    }

    // B. Delay Alert (Delay >= 4 min or bus status is 'Delayed')
    if (bus.status === 'Delayed' || delay >= 4) {
      const displayDelay = delay > 0 ? delay : 6;
      const eventKey = `delay_${bus.id}_${bus.currentStop || 'corridor'}`;
      emitAlert({
        eventKey,
        type: 'delayed',
        category: 'alerts',
        title: `${bus.number} Delayed`,
        message: `Estimated delay of ~${displayDelay} min along ${bus.routeName || 'corridor'} due to simulated traffic.`,
        busId: bus.id,
        busNumber: bus.number,
        routeNumber: bus.number?.replace(/[^0-9A-Za-z]/g, ''),
        isFavorite: isFav,
        meta: {
          delayMinutes: displayDelay,
          corridor: bus.routeName
        },
        simulatedReason: `Bus ${bus.number} generated this alert because simulated corridor congestion added an estimated delay of ${displayDelay} minutes.`,
        action: {
          label: 'View Delay',
          page: 'tracking',
          busId: bus.id
        }
      }, COOLDOWNS.delayed);
    }

    // C. Crowd Alert (Occupancy >= 80% or crowdLevel is 'HIGH')
    if ((bus.occupancyPercent && bus.occupancyPercent >= 80) || bus.crowdLevel === 'HIGH') {
      const eventKey = `crowd_${bus.id}_${Math.floor(bus.occupancyPercent / 10)}`;
      emitAlert({
        eventKey,
        type: 'crowd',
        category: 'alerts',
        title: `${bus.number} High Occupancy`,
        message: `${bus.number} is currently crowded (${bus.occupancyPercent}% occupancy). Limited seating available.`,
        busId: bus.id,
        busNumber: bus.number,
        routeNumber: bus.number?.replace(/[^0-9A-Za-z]/g, ''),
        isFavorite: isFav,
        meta: {
          occupancy: `${bus.occupancyPercent}%`,
          availableSeats: bus.availableSeats ?? 0
        },
        simulatedReason: `Bus ${bus.number} generated this alert because simulated passenger boarding reached ${bus.occupancyPercent}% capacity.`,
        action: {
          label: 'Check Alternatives',
          page: 'routes'
        }
      }, COOLDOWNS.crowd);
    }
  });

  // 2. Evaluate Routes for Service / Traffic Advisories
  routes.forEach(route => {
    const isFavRoute = favorites.routes?.includes(route.id);
    const delayMin = route.trafficDelayMin || 0;

    if (route.trafficStatus === 'HIGH TRAFFIC' || delayMin >= 6) {
      const eventKey = `route_update_${route.id}_high_traffic`;
      emitAlert({
        eventKey,
        type: 'route_update',
        category: 'route',
        title: `Route ${route.number} Service Advisory`,
        message: `High traffic congestion along ${route.name} with estimated delay of ~${delayMin} min.`,
        routeId: route.id,
        routeNumber: route.number,
        isFavorite: isFavRoute,
        meta: {
          routeNumber: route.number,
          routeName: route.name,
          delayMinutes: delayMin
        },
        simulatedReason: `Route ${route.number} generated this alert because simulated throughput telemetry flagged elevated corridor congestion.`,
        action: {
          label: 'View Route',
          page: 'routes'
        }
      }, COOLDOWNS.route_update);
    }
  });

  return newAlerts;
}

/**
 * Creates a destination stop proximity alert payload
 */
export function createDestinationStopAlert({ busId, busNumber, stopId, stopName, distanceKm }) {
  const cleanStop = stopName ? stopName.split(' (')[0] : 'your destination';
  const eventKey = `stop_alert_${busId}_${stopId}`;

  return {
    eventKey,
    type: 'stop',
    category: 'bus',
    title: 'Destination Stop Approaching',
    message: `Your destination stop (${cleanStop}) is approaching. Prepare to alight.`,
    busId,
    busNumber: busNumber || 'SmartBus',
    isHighPriority: true,
    meta: {
      stopId,
      stopName: cleanStop,
      distanceKm: distanceKm ? `${distanceKm} km` : 'Approaching'
    },
    simulatedReason: `Generated because simulated vehicle telemetry detected proximity within 1.5 km of your selected destination stop (${cleanStop}).`,
    action: {
      label: 'Track Bus',
      page: 'tracking',
      busId
    }
  };
}

export default {
  evaluateTransitAlerts,
  explainNotificationTrigger,
  createDestinationStopAlert
};
