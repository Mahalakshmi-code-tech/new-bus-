// SmartBus Transit Intelligence Data & Telemetry Models

export const INITIAL_STOPS = [
  {
    id: 'stop-guindy',
    name: 'Guindy',
    area: 'South Hub',
    lat: 13.0067,
    lng: 80.2025,
    mapX: 180,
    mapY: 260,
    connections: ['Bus 21A', 'Bus 402', 'Suburban Metro'],
    nextBus: 'Bus 21A',
    nextEta: '4 min'
  },
  {
    id: 'stop-saidapet',
    name: 'Saidapet',
    area: 'Transit Bridge',
    lat: 13.0213,
    lng: 80.2231,
    mapX: 250,
    mapY: 220,
    connections: ['Bus 21A', 'Bus 101'],
    nextBus: 'Bus 21A',
    nextEta: '7 min'
  },
  {
    id: 'stop-teynampet',
    name: 'Teynampet',
    area: 'Arterial Central',
    lat: 13.0405,
    lng: 80.2505,
    mapX: 330,
    mapY: 180,
    connections: ['Bus 21A', 'Subway Line 1'],
    nextBus: 'Bus 21A',
    nextEta: '14 min'
  },
  {
    id: 'stop-central',
    name: 'Central Bus Stand (Chennai Central)',
    area: 'Metropolitan Terminal',
    lat: 13.0827,
    lng: 80.2707,
    mapX: 420,
    mapY: 130,
    connections: ['Bus 21A', 'Bus 101', 'Bus 102', 'Intercity Rail'],
    nextBus: 'Bus 21A',
    nextEta: '21 min'
  },
  {
    id: 'stop-market',
    name: 'Market Square',
    area: 'Downtown Center',
    lat: 13.0712,
    lng: 80.2312,
    mapX: 280,
    mapY: 130,
    connections: ['Bus 101', 'Bus 402', 'Route C'],
    nextBus: 'Bus 402',
    nextEta: '2 min'
  },
  {
    id: 'stop-civic',
    name: 'Civic Hub',
    area: 'Administrative Plaza',
    lat: 13.0610,
    lng: 80.2450,
    mapX: 360,
    mapY: 200,
    connections: ['Bus 101', 'Bus 204'],
    nextBus: 'Bus 101',
    nextEta: '6 min'
  },
  {
    id: 'stop-tech-plaza',
    name: 'Tech Plaza',
    area: 'Innovation Sector',
    lat: 13.0510,
    lng: 80.2600,
    mapX: 520,
    mapY: 200,
    connections: ['Bus 102', 'Bus 108'],
    nextBus: 'Bus 102',
    nextEta: '3 min'
  },
  {
    id: 'stop-college',
    name: 'College Gate Terminal',
    area: 'University District',
    lat: 13.0300,
    lng: 80.2750,
    mapX: 600,
    mapY: 270,
    connections: ['Bus 101', 'Bus 102'],
    nextBus: 'Bus 101',
    nextEta: '18 min'
  },
  {
    id: 'stop-east',
    name: 'East Terminal',
    area: 'Harbor Gateway',
    lat: 13.0200,
    lng: 80.2900,
    mapX: 680,
    mapY: 270,
    connections: ['Bus 101', 'Coastal Shuttle'],
    nextBus: 'Bus 101',
    nextEta: '25 min'
  },
  {
    id: 'stop-river',
    name: 'River Road',
    area: 'Riverside Walk',
    lat: 13.0100,
    lng: 80.2400,
    mapX: 470,
    mapY: 330,
    connections: ['Bus 204'],
    nextBus: 'Bus 204',
    nextEta: '12 min'
  }
];

export const INITIAL_ROUTES = [
  {
    id: 'route-21a',
    number: '21A',
    name: 'Guindy to Chennai Central Corridor',
    from: 'Guindy',
    to: 'Central Bus Stand',
    distanceKm: 14.2,
    baseTravelTimeMin: 32,
    stops: ['Guindy', 'Saidapet', 'Teynampet', 'Central Bus Stand (Chennai Central)'],
    frequency: 'Every 8 mins',
    assignedBuses: ['Bus 21A', 'Bus 402'],
    trafficStatus: 'MEDIUM TRAFFIC',
    trafficDelayMin: 5,
    pathCoordinates: [
      { x: 180, y: 260 },
      { x: 250, y: 220 },
      { x: 330, y: 180 },
      { x: 420, y: 130 }
    ]
  },
  {
    id: 'route-101',
    number: '101',
    name: 'Central to College Terminal',
    from: 'Central Depot',
    to: 'College Campus Terminal',
    distanceKm: 18.4,
    baseTravelTimeMin: 42,
    stops: ['Market Square', 'Civic Hub', 'Tech Plaza', 'College Gate Terminal', 'East Terminal'],
    frequency: 'Every 10 mins',
    assignedBuses: ['Bus 101'],
    trafficStatus: 'LOW TRAFFIC',
    trafficDelayMin: 0,
    pathCoordinates: [
      { x: 280, y: 130 },
      { x: 360, y: 200 },
      { x: 520, y: 200 },
      { x: 600, y: 270 },
      { x: 680, y: 270 }
    ]
  },
  {
    id: 'route-102',
    number: '102',
    name: 'Tech Park Express',
    from: 'Financial Hub',
    to: 'Tech Plaza Innovation',
    distanceKm: 12.1,
    baseTravelTimeMin: 25,
    stops: ['Market Square', 'Tech Plaza', 'East Terminal'],
    frequency: 'Every 12 mins',
    assignedBuses: ['Bus 102'],
    trafficStatus: 'LOW TRAFFIC',
    trafficDelayMin: 1,
    pathCoordinates: [
      { x: 280, y: 130 },
      { x: 440, y: 160 },
      { x: 520, y: 200 },
      { x: 680, y: 270 }
    ]
  },
  {
    id: 'route-204',
    number: '204',
    name: 'Riverside Loop',
    from: 'Civic Hub',
    to: 'River Road Marina',
    distanceKm: 9.8,
    baseTravelTimeMin: 22,
    stops: ['Civic Hub', 'River Road', 'Saidapet'],
    frequency: 'Every 15 mins',
    assignedBuses: ['Bus 204'],
    trafficStatus: 'HIGH TRAFFIC',
    trafficDelayMin: 8,
    pathCoordinates: [
      { x: 360, y: 200 },
      { x: 470, y: 330 },
      { x: 250, y: 220 }
    ]
  }
];

export const INITIAL_BUSES = [
  {
    id: 'bus-21a',
    number: '21A',
    plate: 'TN-01-SB-2101',
    routeId: 'route-21a',
    routeName: 'Guindy to Chennai Central',
    currentStop: 'Saidapet',
    nextStop: 'Teynampet',
    destination: 'Central Bus Stand',
    status: 'Approaching', // 'On Time' | 'Delayed' | 'Approaching' | 'At Stop' | 'Out of Service'
    normalEtaMinutes: 5,
    trafficAdjustedEtaMinutes: 7,
    speedKmH: 38,
    totalSeats: 45,
    standingCapacity: 15,
    totalCapacity: 60,
    availableSeats: 16,
    standingPassengers: 0,
    occupancyPercent: 65,
    occupancyLevel: 'MEDIUM', // 'LOW' | 'MEDIUM' | 'HIGH'
    crowdLevel: 'MODERATE',
    capacity: '29 / 45 Seated',
    driver: 'Karthik Raman',
    fuelType: 'Electric Fleet Zero-Emission',
    isSimulated: true,
    lastUpdated: '12s ago',
    coordinates: { x: 250, y: 220 },
    headingDeg: 55,
    waypointIndex: 1,
    waypoints: [
      { x: 180, y: 260 },
      { x: 215, y: 240 },
      { x: 250, y: 220 },
      { x: 290, y: 200 },
      { x: 330, y: 180 },
      { x: 375, y: 155 },
      { x: 420, y: 130 }
    ]
  },
  {
    id: 'bus-101',
    number: 'Bus 101',
    plate: 'TN-01-SB-1010',
    routeId: 'route-101',
    routeName: 'Central to College Terminal',
    currentStop: 'Market Square',
    nextStop: 'Civic Hub',
    destination: 'College Campus Terminal',
    status: 'On Time',
    normalEtaMinutes: 6,
    trafficAdjustedEtaMinutes: 6,
    speedKmH: 42,
    totalSeats: 45,
    standingCapacity: 15,
    totalCapacity: 60,
    availableSeats: 11,
    standingPassengers: 0,
    occupancyPercent: 76,
    occupancyLevel: 'MEDIUM',
    crowdLevel: 'MODERATE',
    capacity: '34 / 45 Seated',
    driver: 'Sarah Jenkins',
    fuelType: 'Hybrid Low-Emission',
    isSimulated: true,
    lastUpdated: '8s ago',
    coordinates: { x: 360, y: 200 },
    headingDeg: 120,
    waypointIndex: 1,
    waypoints: [
      { x: 280, y: 130 },
      { x: 320, y: 165 },
      { x: 360, y: 200 },
      { x: 440, y: 200 },
      { x: 520, y: 200 },
      { x: 560, y: 235 },
      { x: 600, y: 270 },
      { x: 640, y: 270 },
      { x: 680, y: 270 }
    ]
  },
  {
    id: 'bus-102',
    number: 'Bus 102',
    plate: 'TN-01-SB-1025',
    routeId: 'route-102',
    routeName: 'Tech Park Express',
    currentStop: 'Market Square',
    nextStop: 'Tech Plaza',
    destination: 'East Terminal',
    status: 'On Time',
    normalEtaMinutes: 3,
    trafficAdjustedEtaMinutes: 4,
    speedKmH: 48,
    totalSeats: 45,
    standingCapacity: 15,
    totalCapacity: 60,
    availableSeats: 26,
    standingPassengers: 0,
    occupancyPercent: 42,
    occupancyLevel: 'LOW',
    crowdLevel: 'LOW',
    capacity: '19 / 45 Seated',
    driver: 'Alex Chen',
    fuelType: 'Electric Ultra-Fast Fleet',
    isSimulated: true,
    lastUpdated: '4s ago',
    coordinates: { x: 520, y: 200 },
    headingDeg: 90,
    waypointIndex: 2,
    waypoints: [
      { x: 280, y: 130 },
      { x: 360, y: 145 },
      { x: 440, y: 160 },
      { x: 480, y: 180 },
      { x: 520, y: 200 },
      { x: 600, y: 235 },
      { x: 680, y: 270 }
    ]
  },
  {
    id: 'bus-204',
    number: 'Bus 204',
    plate: 'TN-01-SB-2044',
    routeId: 'route-204',
    routeName: 'Riverside Loop',
    currentStop: 'Civic Hub',
    nextStop: 'River Road',
    destination: 'Saidapet Return',
    status: 'Delayed',
    normalEtaMinutes: 8,
    trafficAdjustedEtaMinutes: 14,
    speedKmH: 24,
    totalSeats: 45,
    standingCapacity: 15,
    totalCapacity: 60,
    availableSeats: 0,
    standingPassengers: 8,
    occupancyPercent: 88,
    occupancyLevel: 'HIGH',
    crowdLevel: 'HIGH',
    capacity: '45 / 45 Seated + 8 Stand',
    driver: 'Marcus Vance',
    fuelType: 'Clean CNG',
    isSimulated: true,
    lastUpdated: '15s ago',
    coordinates: { x: 470, y: 330 },
    headingDeg: 160,
    waypointIndex: 1,
    waypoints: [
      { x: 360, y: 200 },
      { x: 415, y: 265 },
      { x: 470, y: 330 },
      { x: 360, y: 275 },
      { x: 250, y: 220 }
    ]
  },
  {
    id: 'bus-308',
    number: 'Bus 308',
    plate: 'TN-01-SB-3088',
    routeId: 'route-101',
    routeName: 'Suburban Depot Shuttle',
    currentStop: 'East Depot Bay',
    nextStop: 'Depot Yard',
    destination: 'Depot Maintenance',
    status: 'Out of Service',
    normalEtaMinutes: 0,
    trafficAdjustedEtaMinutes: 0,
    speedKmH: 0,
    totalSeats: 45,
    standingCapacity: 15,
    totalCapacity: 60,
    availableSeats: 45,
    standingPassengers: 0,
    occupancyPercent: 0,
    occupancyLevel: 'LOW',
    crowdLevel: 'LOW',
    capacity: '0 / 45 Seated',
    driver: 'Off Duty',
    fuelType: 'Electric',
    isSimulated: true,
    lastUpdated: '1m ago',
    coordinates: { x: 710, y: 150 },
    headingDeg: 0,
    waypointIndex: 0,
    waypoints: [{ x: 710, y: 150 }]
  },
  {
    id: 'bus-402',
    number: 'Bus 402',
    plate: 'TN-01-SB-4020',
    routeId: 'route-21a',
    routeName: 'Downtown Express Connector',
    currentStop: 'Guindy',
    nextStop: 'Saidapet',
    destination: 'Chennai Central',
    status: 'At Stop',
    normalEtaMinutes: 2,
    trafficAdjustedEtaMinutes: 2,
    speedKmH: 0,
    totalSeats: 45,
    standingCapacity: 15,
    totalCapacity: 60,
    availableSeats: 21,
    standingPassengers: 0,
    occupancyPercent: 54,
    occupancyLevel: 'MEDIUM',
    crowdLevel: 'MODERATE',
    capacity: '24 / 45 Seated',
    driver: 'Devaki Nair',
    fuelType: 'Electric Fleet',
    isSimulated: true,
    lastUpdated: 'Just now',
    coordinates: { x: 180, y: 260 },
    headingDeg: 45,
    waypointIndex: 0,
    waypoints: [
      { x: 180, y: 260 },
      { x: 250, y: 220 },
      { x: 330, y: 180 },
      { x: 420, y: 130 }
    ]
  }
];

export const INITIAL_INCIDENT_REPORTS = [
  {
    id: 'TKT-8901',
    issueType: 'Bus Delay',
    busNumber: 'Bus 204',
    location: 'River Road Bypass',
    description: 'Heavy traffic congestion due to pipeline road work near River Road, causing +8 min delay.',
    severity: 'Medium',
    status: 'Under Investigation',
    reportedBy: 'Alex Commuter',
    timestamp: '15 mins ago',
    reportedAt: new Date(Date.now() - 15 * 60000).toISOString()
  },
  {
    id: 'TKT-8902',
    issueType: 'Overcrowding',
    busNumber: 'Bus 21A',
    location: 'Guindy Metro Gate',
    description: 'High commuter surge observed at 08:30 AM peak. Overcrowding at entrance doors.',
    severity: 'Medium',
    status: 'Pending',
    reportedBy: 'Devi S.',
    timestamp: '32 mins ago',
    reportedAt: new Date(Date.now() - 32 * 60000).toISOString()
  },
  {
    id: 'TKT-8898',
    issueType: 'Stop Issue',
    busNumber: 'Bus 101',
    location: 'Market Square Platform 2',
    description: 'Digital display board showing inverted route schedule. Display reboot required.',
    severity: 'Low',
    status: 'Resolved',
    reportedBy: 'Driver Sarah Jenkins',
    timestamp: '2 hours ago',
    reportedAt: new Date(Date.now() - 120 * 60000).toISOString()
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'approaching',
    title: 'Bus Approaching',
    message: 'Bus 21A is arriving at your selected stop (Saidapet) in 5 minutes.',
    timestamp: '2 mins ago',
    read: false,
    busId: 'bus-21a',
    routeNumber: '21A'
  },
  {
    id: 'notif-2',
    type: 'delayed',
    title: 'Traffic Delay Notice',
    message: 'Bus 204 is delayed by 6 minutes on River Road due to heavy lane congestion.',
    timestamp: '14 mins ago',
    read: false,
    busId: 'bus-204',
    routeNumber: '204'
  },
  {
    id: 'notif-3',
    type: 'route_changed',
    title: 'Express Corridor Activated',
    message: 'Route 21A has activated the arterial bypass via Teynampet for quicker commuter transit.',
    timestamp: '1 hour ago',
    read: true,
    busId: 'bus-21a',
    routeNumber: '21A'
  },
  {
    id: 'notif-4',
    type: 'announcement',
    title: 'Eco Mobility Milestone',
    message: '🌱 Fleet operations saved 1.8 metric tons of estimated CO₂ this morning!',
    timestamp: '3 hours ago',
    read: true
  }
];

export const INITIAL_DIGITAL_PASS = {
  passId: 'SB-METRO-2026-X889',
  passengerName: 'Alex Commuter',
  passType: 'Monthly All-Corridor Metro Pass',
  validFrom: '2026-09-01',
  validUntil: '2026-09-30',
  status: 'Active',
  tier: 'Gold Commuter',
  qrData: 'SMARTBUS:AlexCommuter:PASS-2026-X889:VALID:ALL_ZONES',
  tripsCount: 42,
  fareSaved: '$34.50'
};

// Utility calculation helpers
export function calculateTrafficAdjustedEta(baseMinutes, trafficCondition) {
  if (baseMinutes <= 0) return 0;
  switch (trafficCondition) {
    case 'HIGH':
      return Math.round(baseMinutes * 1.55 + 3);
    case 'MEDIUM':
      return Math.round(baseMinutes * 1.25 + 1);
    case 'LOW':
    default:
      return baseMinutes;
  }
}

export function getOccupancyBadge(percent) {
  if (percent >= 80) return { label: 'HIGH', color: 'text-error bg-error-container/60 border-error/30' };
  if (percent >= 45) return { label: 'MEDIUM', color: 'text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 border-amber-300/60' };
  return { label: 'LOW', color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300/60' };
}

export function calculateEcoSavings(distanceKm, tripsCount = 1) {
  // Average car emits ~150g CO2/km; Electric/Hybrid bus per passenger emits ~30g CO2/km. Net savings ~120g/km.
  const co2SavedKg = ((distanceKm * 0.12) * tripsCount).toFixed(1);
  const fuelSavedLiters = ((distanceKm / 12) * tripsCount).toFixed(1); // Assuming 12km/L for avg car
  return {
    co2SavedKg: parseFloat(co2SavedKg),
    fuelSavedLiters: parseFloat(fuelSavedLiters),
    treesEquiv: Math.max(1, Math.round(parseFloat(co2SavedKg) / 21)) // ~21kg CO2 absorbed per tree/year
  };
}

/**
 * Derives three crowd tiers: LOW (<50%), MODERATE (50%-79%), HIGH (>=80%)
 */
export function getCrowdLevel(occupancyPercent) {
  if (occupancyPercent >= 80) return 'HIGH';
  if (occupancyPercent >= 50) return 'MODERATE';
  return 'LOW';
}

/**
 * Accessible multi-sensory crowd level badges and text
 */
export function getCrowdBadgeInfo(level) {
  switch (level) {
    case 'HIGH':
      return {
        level: 'HIGH',
        label: '🔴 High / Full',
        shortLabel: '🔴 Full',
        subtext: 'Bus is crowded or full',
        colorClass: 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-950/60 border-red-500/40',
        badgeColor: 'bg-red-500',
        dotColor: 'bg-red-500',
        barColor: 'bg-red-500',
        suggestion: '🔴 This bus is currently crowded. Consider the next bus.'
      };
    case 'MODERATE':
      return {
        level: 'MODERATE',
        label: '🟡 Moderate',
        shortLabel: '🟡 Moderate',
        subtext: 'Limited seats available',
        colorClass: 'text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 border-amber-500/40',
        badgeColor: 'bg-amber-500',
        dotColor: 'bg-amber-500',
        barColor: 'bg-amber-500',
        suggestion: '🟡 Moderate crowd expected.'
      };
    case 'LOW':
    default:
      return {
        level: 'LOW',
        label: '🟢 Low',
        shortLabel: '🟢 Low Crowd',
        subtext: 'Plenty of seats available',
        colorClass: 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 border-emerald-500/40',
        badgeColor: 'bg-emerald-500',
        dotColor: 'bg-emerald-500',
        barColor: 'bg-emerald-500',
        suggestion: '🟢 Plenty of seats available. Good time to board.'
      };
  }
}

/**
 * Intelligent Commuter Advice
 */
export function getSmartPassengerSuggestion(crowdLevel, availableSeats = 0) {
  if (crowdLevel === 'HIGH' || availableSeats <= 2) {
    return '🔴 This bus is currently crowded. Consider the next bus.';
  }
  if (crowdLevel === 'MODERATE' || availableSeats <= 15) {
    return '🟡 Moderate crowd expected.';
  }
  return '🟢 Plenty of seats available. Good time to board.';
}

