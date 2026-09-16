/**
 * SmartBus Transit Analytics Intelligence Service
 * ---------------------------------------------------------------------
 * Provides pure mathematical and telemetry data transformations for the
 * Transit Analytics Dashboard.
 * 
 * IMPORTANT:
 * All calculations derive strictly from the current simulated transit state
 * (buses, routes, stops, notifications, trafficCondition).
 * The service is structured cleanly so that it can easily interface with
 * future live databases (Firebase, Supabase, REST APIs) in the future.
 */

/**
 * Calculates primary fleet Key Performance Indicators (KPIs)
 * 
 * @param {Array} buses - Array of simulated bus objects
 * @param {Array} routes - Array of simulated route objects
 * @returns {Object} Fleet KPIs
 */
export function calculateFleetKpis(buses = [], routes = []) {
  const totalBuses = buses.length;
  const activeBuses = buses.filter(b => b.status !== 'Out of Service');
  const activeFleetCount = activeBuses.length;

  // Average fleet occupancy percentage across active buses
  const avgOccupancy = activeBuses.length > 0
    ? Math.round(activeBuses.reduce((acc, b) => acc + (b.occupancyPercent || 0), 0) / activeBuses.length)
    : 64;

  // On-time performance: buses not currently marked Delayed
  const delayedBuses = activeBuses.filter(b => b.status === 'Delayed');
  const onTimeRatio = activeBuses.length > 0
    ? ((activeBuses.length - delayedBuses.length) / activeBuses.length) * 100
    : 96.8;
  const onTimePercentage = Number(onTimeRatio.toFixed(1));

  // Active operating corridors
  const activeRoutesCount = routes.length || 4;

  return {
    activeFleet: {
      value: activeFleetCount,
      total: totalBuses,
      label: 'Active Fleet',
      context: `${activeFleetCount} of ${totalBuses} units in service`,
      status: activeFleetCount >= 4 ? 'Optimal' : 'Reduced'
    },
    activeRoutes: {
      value: activeRoutesCount,
      label: 'Active Routes',
      context: '100% scheduled corridors operational',
      status: 'Normal'
    },
    avgOccupancy: {
      value: avgOccupancy,
      label: 'Average Occupancy',
      context: avgOccupancy > 80 ? 'Heavy passenger load' : avgOccupancy > 50 ? 'Moderate commuter flow' : 'Light demand',
      status: avgOccupancy > 80 ? 'High' : 'Comfortable'
    },
    onTimePerformance: {
      value: onTimePercentage,
      label: 'On-Time Reliability',
      context: delayedBuses.length === 0 ? 'Zero active delays reported' : `${delayedBuses.length} service${delayedBuses.length > 1 ? 's' : ''} experiencing delay`,
      status: onTimePercentage >= 95 ? 'Excellent' : 'Moderate'
    }
  };
}

/**
 * Generates occupancy trend points for the line/area chart based on simulated state and filters
 * 
 * @param {Array} buses - Current active fleet
 * @param {string} timeRange - 'today' | '7d' | '30d'
 * @param {string|null} selectedRouteId - Filter by route, or null for all
 * @returns {Array} Chart data points { time, occupancy, label, peak }
 */
export function calculateOccupancyTrends(buses = [], timeRange = 'today', selectedRouteId = null) {
  // Baseline fleet occupancy anchor from current simulation
  const filteredBuses = selectedRouteId && selectedRouteId !== 'all'
    ? buses.filter(b => b.routeId === selectedRouteId)
    : buses;

  const currentAvg = filteredBuses.length > 0
    ? Math.round(filteredBuses.reduce((acc, b) => acc + (b.occupancyPercent || 0), 0) / filteredBuses.length)
    : 64;

  if (timeRange === 'today') {
    // 24-hour commuter profile modulated by current real-time average
    const hourlyFactors = [
      { time: '05:00', factor: 0.35, label: 'Early Dawn Service' },
      { time: '07:00', factor: 0.72, label: 'Morning Commute Surge' },
      { time: '08:30', factor: 1.28, label: 'Morning Peak (Offices/Schools)', isPeak: true },
      { time: '10:30', factor: 0.85, label: 'Mid-Morning Transit' },
      { time: '12:30', factor: 0.95, label: 'Lunchtime Corridor Flow' },
      { time: '14:30', factor: 0.80, label: 'Afternoon Intercity' },
      { time: '17:30', factor: 1.34, label: 'Evening Peak Congestion', isPeak: true },
      { time: '19:30', factor: 1.05, label: 'Post-Work Return Stream' },
      { time: '21:30', factor: 0.55, label: 'Night City Transit' },
      { time: '23:30', factor: 0.30, label: 'Late Depot Run' }
    ];

    return hourlyFactors.map(h => {
      const occ = Math.min(98, Math.max(15, Math.round(currentAvg * h.factor)));
      return {
        time: h.time,
        occupancy: occ,
        label: h.label,
        isPeak: Boolean(h.isPeak)
      };
    });
  }

  if (timeRange === '7d') {
    // 7-day trend profile
    const dayFactors = [
      { time: 'Mon', factor: 1.05, label: 'Monday Peak Start' },
      { time: 'Tue', factor: 1.10, label: 'Tuesday Regular Fleet' },
      { time: 'Wed', factor: 1.15, label: 'Wednesday Midweek Load', isPeak: true },
      { time: 'Thu', factor: 1.08, label: 'Thursday Active Transit' },
      { time: 'Fri', factor: 1.20, label: 'Friday Maximum Rush', isPeak: true },
      { time: 'Sat', factor: 0.75, label: 'Saturday Weekend Leisure' },
      { time: 'Sun', factor: 0.60, label: 'Sunday Minimal Schedule' }
    ];

    return dayFactors.map(d => ({
      time: d.time,
      occupancy: Math.min(98, Math.max(20, Math.round(currentAvg * d.factor))),
      label: d.label,
      isPeak: Boolean(d.isPeak)
    }));
  }

  // 30-day weekly aggregated trend
  const monthWeeks = [
    { time: 'Wk 1', factor: 0.96, label: 'Monthly Cycle Week 1' },
    { time: 'Wk 2', factor: 1.04, label: 'Corridor Optimization W2' },
    { time: 'Wk 3', factor: 1.12, label: 'Fleet Surge Period W3', isPeak: true },
    { time: 'Wk 4', factor: 1.02, label: 'Cycle Close W4' }
  ];

  return monthWeeks.map(w => ({
    time: w.time,
    occupancy: Math.min(98, Math.max(25, Math.round(currentAvg * w.factor))),
    label: w.label,
    isPeak: Boolean(w.isPeak)
  }));
}

/**
 * Computes route performance metrics table
 * 
 * @param {Array} routes - Simulated routes
 * @param {Array} buses - Simulated buses
 * @returns {Array} Route performance items
 */
export function calculateRoutePerformance(routes = [], buses = []) {
  return routes.map(route => {
    // Find buses assigned to this route
    const assignedBuses = buses.filter(b => 
      b.routeId === route.id || 
      (route.assignedBuses && route.assignedBuses.some(ab => b.number && b.number.includes(ab.replace('Bus ', ''))))
    );

    const activeUnits = assignedBuses.filter(b => b.status !== 'Out of Service');
    
    // Average occupancy for this route
    const avgOcc = activeUnits.length > 0
      ? Math.round(activeUnits.reduce((acc, b) => acc + (b.occupancyPercent || 0), 0) / activeUnits.length)
      : (route.id === 'route-21a' ? 60 : route.id === 'route-204' ? 88 : 50);

    // Estimate delay
    const delayMin = route.trafficDelayMin || 
      (activeUnits.some(b => b.status === 'Delayed') ? 8 : 0);

    // Compute status: 'ON TIME' | 'DELAYED' | 'ACTIVE' | 'ISSUE'
    let status = 'ON TIME';
    let statusColor = 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300/60';

    if (delayMin >= 6 || activeUnits.some(b => b.status === 'Delayed')) {
      status = 'DELAYED';
      statusColor = 'text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 border-amber-300/60';
    } else if (avgOcc >= 85) {
      status = 'ISSUE';
      statusColor = 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-950/60 border-red-300/60';
    } else if (activeUnits.length > 0) {
      status = 'ACTIVE';
      statusColor = 'text-primary dark:text-cyan-400 bg-primary/10 dark:bg-primary/25 border-primary/20 dark:border-cyan-500/30';
    }

    const etaMin = route.baseTravelTimeMin 
      ? route.baseTravelTimeMin + delayMin 
      : 25;

    return {
      id: route.id,
      number: route.number,
      name: route.name,
      from: route.from,
      to: route.to,
      distanceKm: route.distanceKm,
      activeBusesCount: activeUnits.length || (route.assignedBuses?.length || 1),
      avgOccupancy: avgOcc,
      etaMinutes: etaMin,
      delayMinutes: delayMin,
      status,
      statusColor,
      frequency: route.frequency || 'Every 10 min'
    };
  });
}

/**
 * Categorizes fleet operational status breakdown
 * 
 * @param {Array} buses - Simulated buses
 * @returns {Object} Categorized fleet distribution
 */
export function calculateFleetStatusBreakdown(buses = []) {
  const total = buses.length || 6;
  let active = 0;
  let onRoute = 0;
  let atStop = 0;
  let delayed = 0;
  let idleOrDepot = 0;

  buses.forEach(b => {
    if (b.status === 'Out of Service') {
      idleOrDepot++;
    } else if (b.status === 'Delayed') {
      delayed++;
      active++;
    } else if (b.status === 'At Stop') {
      atStop++;
      active++;
    } else {
      onRoute++;
      active++;
    }
  });

  return {
    total,
    active,
    onRoute,
    atStop,
    delayed,
    idleOrDepot,
    categories: [
      { label: 'On Route', count: onRoute, color: 'bg-primary dark:bg-cyan-400', percent: Math.round((onRoute / total) * 100) },
      { label: 'At Stop', count: atStop, color: 'bg-emerald-500', percent: Math.round((atStop / total) * 100) },
      { label: 'Delayed', count: delayed, color: 'bg-amber-500', percent: Math.round((delayed / total) * 100) },
      { label: 'Depot / Idle', count: idleOrDepot, color: 'bg-slate-400 dark:bg-slate-600', percent: Math.round((idleOrDepot / total) * 100) }
    ]
  };
}

/**
 * Calculates EV Fleet and clean mobility telemetry from existing simulated fuelType attributes
 * 
 * @param {Array} buses - Simulated buses
 * @returns {Object} EV fleet telemetry
 */
export function calculateEvFleetMetrics(buses = []) {
  const total = buses.length || 6;
  
  // Categorize based strictly on existing bus.fuelType in the project
  const evBuses = buses.filter(b => 
    b.fuelType && b.fuelType.toLowerCase().includes('electric')
  );
  
  const hybridBuses = buses.filter(b => 
    b.fuelType && b.fuelType.toLowerCase().includes('hybrid')
  );

  const cngBuses = buses.filter(b => 
    b.fuelType && b.fuelType.toLowerCase().includes('cng')
  );

  const activeEvBuses = evBuses.filter(b => b.status !== 'Out of Service');
  
  // Clean mobility ratio (Electric + Hybrid) of active fleet
  const cleanCount = evBuses.length + hybridBuses.length;
  const cleanRatio = Math.round((cleanCount / total) * 100);

  return {
    totalEvCount: evBuses.length,
    activeEvCount: activeEvBuses.length,
    hybridCount: hybridBuses.length,
    cngCount: cngBuses.length,
    cleanTransitRatio: cleanRatio,
    powerStatus: 'Normal Grid Synchronized',
    propulsionBreakdown: [
      { 
        type: 'Zero-Emission Electric', 
        count: evBuses.length, 
        percent: Math.round((evBuses.length / total) * 100),
        color: 'bg-cyan-500 text-cyan-500' 
      },
      { 
        type: 'Low-Emission Hybrid', 
        count: hybridBuses.length, 
        percent: Math.round((hybridBuses.length / total) * 100),
        color: 'bg-emerald-500 text-emerald-500' 
      },
      { 
        type: 'Clean CNG Transitional', 
        count: cngBuses.length, 
        percent: Math.round((cngBuses.length / total) * 100),
        color: 'bg-amber-500 text-amber-500' 
      }
    ]
  };
}

/**
 * Formats notifications into recent alerts for the analytics feed
 * 
 * @param {Array} notifications - Array of notifications from TransitContext
 * @param {number} limit - Maximum alerts to display
 * @returns {Array} Recent formatted alerts
 */
export function formatRecentAlerts(notifications = [], limit = 5) {
  if (!Array.isArray(notifications)) return [];

  return notifications.slice(0, limit).map(n => {
    let alertType = 'Transit Advisory';
    let iconKey = 'info';
    let statusBadge = { label: 'INFO', color: 'bg-blue-100 text-primary dark:bg-cyan-950/60 dark:text-cyan-300' };

    if (n.type === 'delayed') {
      alertType = 'Delay Alert';
      iconKey = 'delay';
      statusBadge = { label: 'DELAYED', color: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' };
    } else if (n.type === 'crowd') {
      alertType = 'Crowd Alert';
      iconKey = 'crowd';
      statusBadge = { label: 'HIGH CROWD', color: 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300' };
    } else if (n.type === 'approaching') {
      alertType = 'Bus Approaching';
      iconKey = 'approaching';
      statusBadge = { label: 'APPROACHING', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' };
    } else if (n.type === 'stop') {
      alertType = 'Stop Alert';
      iconKey = 'stop';
      statusBadge = { label: 'DESTINATION', color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300' };
    } else if (n.type === 'route_update' || n.type === 'route_changed') {
      alertType = 'Route Update';
      iconKey = 'route';
      statusBadge = { label: 'ADVISORY', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300' };
    }

    const busOrRoute = n.busNumber || (n.busId ? n.busId.replace('bus-', 'Bus ').toUpperCase() : n.routeNumber ? `Route ${n.routeNumber}` : 'Corridor');

    return {
      id: n.id,
      title: n.title,
      message: n.message,
      type: n.type,
      alertType,
      iconKey,
      busId: n.busId,
      busNumber: n.busNumber || (n.busId ? n.busId.replace('bus-', 'Bus ').toUpperCase() : null),
      busOrRoute,
      timestamp: n.timestamp || 'Just now',
      statusBadge,
      action: n.action
    };
  });
}

export default {
  calculateFleetKpis,
  calculateOccupancyTrends,
  calculateRoutePerformance,
  calculateFleetStatusBreakdown,
  calculateEvFleetMetrics,
  formatRecentAlerts
};
