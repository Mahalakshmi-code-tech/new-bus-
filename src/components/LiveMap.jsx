import React, { useState } from 'react';
import { 
  Bus, 
  MapPin, 
  Navigation, 
  Layers, 
  Plus, 
  Minus, 
  Maximize2, 
  Wifi, 
  RotateCw,
  Compass,
  AlertTriangle,
  Info,
  X,
  Heart,
  ExternalLink,
  ShieldCheck,
  Zap,
  Gauge
} from 'lucide-react';
import { useTransit } from '../context/TransitContext';
import { getOccupancyBadge } from '../services/transitData';

function LiveMapComponent({ 
  height = 'h-96',
  showOverlay = true,
  onBusSelect,
  className = '',
  selectedBus: propSelectedBus,
  routeName: propRouteName,
  destinationStopId: propDestinationStopId
}) {
  const { 
    buses, 
    selectedBus: contextSelectedBus, 
    setSelectedBusId,
    stops, 
    routes = [],
    trafficCondition, 
    isDemoSimulation, 
    setIsDemoSimulation,
    destinationAlertStopId,
    isFavoriteBus,
    toggleFavoriteBus,
    setIsIncidentModalOpen
  } = useTransit();

  const [zoom, setZoom] = useState(1);
  const [showTrafficLayer, setShowTrafficLayer] = useState(true);
  const [showStopsLayer, setShowStopsLayer] = useState(true);
  const [showIncidentsLayer, setShowIncidentsLayer] = useState(true);
  const [inspectedStop, setInspectedStop] = useState(null);
  const [showInspector, setShowInspector] = useState(true);

  // Resolve currently active bus
  const activeBus = React.useMemo(() => {
    if (propSelectedBus) {
      if (typeof propSelectedBus === 'string') {
        return buses.find(b => b.id === propSelectedBus || b.number === propSelectedBus) || contextSelectedBus;
      }
      return propSelectedBus;
    }
    return contextSelectedBus;
  }, [propSelectedBus, buses, contextSelectedBus]);

  // Resolve currently active route
  const activeRoute = React.useMemo(() => {
    if (propRouteName) {
      const match = routes.find(r => r.name.toLowerCase().includes(propRouteName.toLowerCase()) || r.number.toLowerCase().includes(propRouteName.toLowerCase()));
      if (match) return match;
    }
    if (!activeBus) return routes[0] || null;
    return routes.find(r => r.id === activeBus.routeId || r.number === activeBus.number) || routes[0] || null;
  }, [propRouteName, activeBus, routes]);

  // Resolve terminal destination stop for the route
  const destinationStop = React.useMemo(() => {
    if (activeRoute && activeRoute.stops && activeRoute.stops.length > 0) {
      const lastStopName = activeRoute.stops[activeRoute.stops.length - 1];
      const match = stops.find(s => s.name.toLowerCase().includes(lastStopName.toLowerCase()) || lastStopName.toLowerCase().includes(s.name.toLowerCase()));
      if (match) return match;
    }
    return stops.find(s => s.id === 'stop-central') || stops[stops.length - 1];
  }, [activeRoute, stops]);

  // Resolve passenger's alert destination stop
  const targetStopId = propDestinationStopId || destinationAlertStopId;
  const alertStop = React.useMemo(() => {
    if (!targetStopId) return null;
    return stops.find(s => s.id === targetStopId) || null;
  }, [targetStopId, stops]);

  const handleBusClick = (bus) => {
    setSelectedBusId(bus.id);
    setInspectedStop(null);
    setShowInspector(true);
    if (onBusSelect) onBusSelect(bus);
  };

  const handleStopClick = (stop) => {
    setInspectedStop(stop);
    setShowInspector(true);
  };

  const occupancyInfo = getOccupancyBadge(activeBus?.occupancyPercent ?? 50);

  // Status badge styling helper
  const getStatusColor = (status) => {
    switch (status) {
      case 'Approaching':
        return 'bg-[#00ffff] text-[#001849] border-cyan-400';
      case 'On Time':
        return 'bg-emerald-500 text-white border-emerald-400';
      case 'Delayed':
        return 'bg-amber-500 text-white border-amber-400';
      case 'At Stop':
        return 'bg-primary text-white border-primary-container';
      case 'Out of Service':
      default:
        return 'bg-slate-500 text-white border-slate-400';
    }
  };

  return (
    <div className={`relative w-full ${height} rounded-3xl overflow-hidden shadow-xl border border-white/60 dark:border-slate-800/80 bg-[#e8edf7] dark:bg-[#091122] select-none group transition-colors duration-300 ${className}`}>
      {/* Dynamic Animated Vector SVG City Map Canvas */}
      <svg 
        className="w-full h-full object-cover transition-transform duration-300"
        viewBox="0 0 800 450"
        preserveAspectRatio="xMidYMid slice"
        style={{ transform: `scale(${zoom})` }}
      >
        <defs>
          <linearGradient id="routeGradientA" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0050cb" />
            <stop offset="50%" stopColor="#0066ff" />
            <stop offset="100%" stopColor="#00ffff" />
          </linearGradient>

          <linearGradient id="routeGradient21A" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="50%" stopColor="#00f0ff" />
            <stop offset="100%" stopColor="#0050cb" />
          </linearGradient>

          <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* City Districts / Landmass */}
        <rect width="800" height="450" className="fill-[#eef2f9] dark:fill-[#0b1426] transition-colors duration-300" />
        
        {/* River / Water Body */}
        <path 
          d="M0 320 C 200 360, 300 240, 500 290 C 650 330, 720 280, 800 310 L 800 450 L 0 450 Z" 
          className="fill-[#d4e4f7] dark:fill-[#071932] transition-colors duration-300"
        />

        {/* City Grid Secondary Streets */}
        <g className="stroke-[#d5dde8] dark:stroke-[#18263f] transition-colors duration-300" strokeWidth="2.5">
          <line x1="50" y1="0" x2="50" y2="450" />
          <line x1="120" y1="0" x2="120" y2="450" />
          <line x1="200" y1="0" x2="200" y2="450" />
          <line x1="280" y1="0" x2="280" y2="450" />
          <line x1="360" y1="0" x2="360" y2="450" />
          <line x1="440" y1="0" x2="440" y2="450" />
          <line x1="520" y1="0" x2="520" y2="450" />
          <line x1="600" y1="0" x2="600" y2="450" />
          <line x1="680" y1="0" x2="680" y2="450" />
          <line x1="750" y1="0" x2="750" y2="450" />

          <line x1="0" y1="60" x2="800" y2="60" />
          <line x1="0" y1="130" x2="800" y2="130" />
          <line x1="0" y1="200" x2="800" y2="200" />
          <line x1="0" y1="270" x2="800" y2="270" />
          <line x1="0" y1="340" x2="800" y2="340" />
          <line x1="0" y1="410" x2="800" y2="410" />
        </g>

        {/* Primary Arteries / Highways */}
        <g className="stroke-[#cbd5e1] dark:stroke-[#25395c] transition-colors duration-300" strokeWidth="6" strokeLinecap="round">
          <path d="M 0 100 Q 300 120 450 190 T 800 220" fill="none" />
          <path d="M 150 0 C 180 180 320 280 400 450" fill="none" />
          <path d="M 650 0 C 620 180 500 320 520 450" fill="none" />
        </g>

        {/* Traffic Flow Overlay (Color Coded route segments) */}
        {showTrafficLayer && (
          <g opacity="0.85">
            {/* Low Traffic Corridor (Green) */}
            <path
              d="M 280 130 L 360 200 L 520 200"
              fill="none"
              stroke="#10b981"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="8 4"
            />
            {/* Medium Traffic Segment (Amber: Route 21A Arterial) */}
            <path
              d="M 180 260 L 250 220 L 330 180 L 420 130"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="10 3"
            />
            {/* High Traffic Bottleneck (Red: River Road corridor) */}
            <path
              d="M 360 200 L 470 330"
              fill="none"
              stroke="#ef4444"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeDasharray="6 3"
            />
          </g>
        )}

        {/* All Transit Routes Paths (with Active Route Highlighted) */}
        {routes.map((route) => {
          if (!route.pathCoordinates || route.pathCoordinates.length < 2) return null;
          const isActive = activeRoute?.id === route.id;
          const pathD = route.pathCoordinates.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

          return (
            <g key={route.id}>
              {/* Background Route Line */}
              <path
                d={pathD}
                fill="none"
                stroke={isActive ? 'url(#routeGradient21A)' : '#94a3b8'}
                strokeWidth={isActive ? '6' : '3'}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={isActive ? 1 : 0.4}
                filter={isActive ? 'url(#cyanGlow)' : undefined}
                className={isActive ? 'transition-all duration-300' : ''}
              />
              {/* Animated Dash Wave along Active Route */}
              {isActive && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray="8 12"
                  opacity="0.8"
                  className="animate-[dash_2s_linear_infinite]"
                />
              )}
            </g>
          );
        })}

        {/* Incidents Layer (Alerts on Map) */}
        {showIncidentsLayer && (
          <g transform="translate(470, 310)" className="cursor-pointer">
            <circle cx="0" cy="0" r="14" fill="#ef4444" opacity="0.25" className="animate-ping" />
            <circle cx="0" cy="0" r="9" fill="#ef4444" />
            <text x="0" y="3.5" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">!</text>
            <rect x="-35" y="-22" width="70" height="15" rx="7" fill="#7f1d1d" opacity="0.95" />
            <text x="0" y="-12" fill="#fca5a5" fontSize="7.5" fontWeight="bold" textAnchor="middle" fontFamily="Space Grotesk">
              Roadwork Delay
            </text>
          </g>
        )}

        {/* Transit Stops Nodes */}
        {showStopsLayer && stops.map((stop) => {
          const isInspected = inspectedStop?.id === stop.id;
          const isDestination = destinationStop?.id === stop.id;
          const isAlertStop = alertStop?.id === stop.id;

          return (
            <g 
              key={stop.id} 
              className="cursor-pointer group"
              onClick={() => handleStopClick(stop)}
            >
              {/* Passenger Selected Destination Stop Proximity Beacon */}
              {isAlertStop && (
                <g transform={`translate(${stop.mapX}, ${stop.mapY})`}>
                  <circle cx="0" cy="0" r="22" fill="none" stroke="#00ffff" strokeWidth="2" opacity="0.85" className="animate-ping" />
                  <circle cx="0" cy="0" r="15" fill="none" stroke="#00ffff" strokeWidth="1.5" strokeDasharray="4 3" />
                  <g transform="translate(0, -22)">
                    <rect x="-36" y="-14" width="72" height="17" rx="8.5" fill="#001849" stroke="#00ffff" strokeWidth="1.5" />
                    <text x="0" y="-2.5" fill="#00ffff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="Space Grotesk">
                      🔔 MY STOP
                    </text>
                  </g>
                </g>
              )}

              {/* Terminal Destination Stop Badge */}
              {isDestination && !isAlertStop && (
                <g transform={`translate(${stop.mapX}, ${stop.mapY - 22})`}>
                  <rect x="-34" y="-14" width="68" height="17" rx="8.5" fill="#064e3b" stroke="#10b981" strokeWidth="1.2" />
                  <text x="0" y="-2.5" fill="#a7f3d0" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="Space Grotesk">
                    🏁 DESTINATION
                  </text>
                </g>
              )}

              {/* Stop Node Circle */}
              <circle 
                cx={stop.mapX} 
                cy={stop.mapY} 
                r={isInspected || isDestination || isAlertStop ? 8 : 6} 
                className={`transition-all duration-300 stroke-2 ${
                  isAlertStop
                    ? 'fill-cyan-400 stroke-[#001849] ring-4 ring-cyan-400'
                    : isDestination
                      ? 'fill-emerald-500 stroke-white ring-4 ring-emerald-400'
                      : isInspected 
                        ? 'fill-primary dark:fill-cyan-400 stroke-white dark:stroke-slate-900 ring-4 ring-cyan-400' 
                        : 'fill-white dark:fill-slate-900 stroke-primary dark:stroke-cyan-400 hover:scale-125'
                }`} 
              />

              {/* Stop Name Label */}
              <text 
                x={stop.mapX} 
                y={stop.mapY + 16} 
                className="fill-[#424656] dark:fill-slate-300 transition-colors pointer-events-none" 
                fontSize="8.5" 
                fontWeight="700" 
                textAnchor="middle" 
                fontFamily="Inter"
              >
                {stop.name.split(' (')[0]}
              </text>
            </g>
          );
        })}

        {/* Live Buses Markers (Smoothly Moving along Waypoints) */}
        {buses.map((bus) => {
          if (bus.status === 'Out of Service') return null;
          const isSelected = activeBus?.id === bus.id;

          return (
            <g 
              key={bus.id}
              style={{
                transform: `translate(${bus.coordinates.x}px, ${bus.coordinates.y}px)`,
                transition: 'transform 0.4s linear'
              }}
              className="cursor-pointer"
              onClick={() => handleBusClick(bus)}
            >
              {/* Pulsing Location Indicator for selected or active bus */}
              {isSelected ? (
                <>
                  <circle 
                    cx="0" 
                    cy="0" 
                    r="26" 
                    fill="none" 
                    stroke="#00ffff" 
                    strokeWidth="2" 
                    opacity="0.75" 
                    className="animate-ping" 
                  />
                  <circle 
                    cx="0" 
                    cy="0" 
                    r="16" 
                    fill="rgba(0, 80, 203, 0.4)" 
                    stroke="#00ffff" 
                    strokeWidth="2" 
                  />
                </>
              ) : (
                <circle 
                  cx="0" 
                  cy="0" 
                  r="15" 
                  fill="none" 
                  stroke={bus.status === 'Delayed' ? '#f59e0b' : '#38bdf8'} 
                  strokeWidth="1.5" 
                  opacity="0.5" 
                  className="animate-ping" 
                />
              )}
              
              {/* Heading Direction Pointer (Rotates with vehicle heading) */}
              <g transform={`rotate(${bus.headingDeg || 0})`}>
                <polygon 
                  points="0,-19 -4,-13 4,-13" 
                  fill={isSelected ? '#00ffff' : '#38bdf8'} 
                />
              </g>

              {/* Main Bus Body Badge */}
              <circle 
                cx="0" 
                cy="0" 
                r={isSelected ? "13" : "9.5"} 
                fill={isSelected ? '#0050cb' : '#0f172a'} 
                stroke={isSelected ? '#00ffff' : '#38bdf8'} 
                strokeWidth={isSelected ? '2.5' : '1.8'} 
              />

              {/* Bus Glyph Icon */}
              {isSelected ? (
                <text 
                  x="0" 
                  y="4.5" 
                  fill="#ffffff" 
                  fontSize="12" 
                  textAnchor="middle" 
                  className="select-none pointer-events-none"
                >
                  🚌
                </text>
              ) : (
                <circle 
                  cx="0" 
                  cy="0" 
                  r="3" 
                  fill={bus.status === 'Delayed' ? '#f59e0b' : '#38bdf8'} 
                />
              )}

              {/* Vehicle Tooltip Tag */}
              <g transform="translate(0, -24)">
                <rect 
                  x="-34" 
                  y="-14" 
                  width="68" 
                  height="18" 
                  rx="9" 
                  fill={isSelected ? '#001849' : '#1e293b'} 
                  opacity="0.95" 
                  stroke={isSelected ? '#00ffff' : 'transparent'} 
                  strokeWidth={isSelected ? '1.5' : '0'} 
                />
                <text 
                  x="0" 
                  y="-2" 
                  fill={isSelected ? '#00ffff' : '#ffffff'} 
                  fontSize="8.5" 
                  fontWeight="bold" 
                  textAnchor="middle" 
                  fontFamily="Space Grotesk"
                >
                  {bus.number}
                </text>
              </g>
            </g>
          );
        })}
      </svg>

      {/* Top Map Controls Bar */}
      <div className="absolute top-3 left-3 right-3 flex justify-between items-start pointer-events-none gap-2">
        {/* Live Simulation Status Pill */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 pointer-events-auto">
          <div className="glass-panel dark:bg-slate-900/90 px-3.5 py-1.5 rounded-full flex items-center space-x-2 shadow-md border border-white/80 dark:border-slate-750">
            <span className={`w-2.5 h-2.5 rounded-full ${isDemoSimulation ? 'bg-cyan-400 animate-ping' : 'bg-emerald-400 animate-ping'}`} />
            <span className="text-[10px] sm:text-[11px] font-label font-black text-primary dark:text-cyan-400 uppercase tracking-wider">
              {isDemoSimulation ? 'LIVE SIMULATION' : 'REAL-TIME GPS TELEMETRY'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsDemoSimulation(!isDemoSimulation)}
            className="px-2.5 py-1 rounded-full text-[10px] font-label font-bold uppercase tracking-wider bg-white/85 dark:bg-slate-800 text-on-surface-variant dark:text-slate-300 hover:text-primary border border-outline-variant/40 dark:border-slate-700 shadow-xs transition-colors"
            title="Toggle between Simulation and Real GPS mode"
          >
            {isDemoSimulation ? 'DEMO TRACKING' : 'REAL GPS'}
          </button>
        </div>

        {/* Controls: Layers & Zoom */}
        <div className="flex items-center space-x-1.5 pointer-events-auto">
          {/* Traffic Toggle */}
          <button
            onClick={() => setShowTrafficLayer(!showTrafficLayer)}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center transition-all shadow-md text-xs font-bold ${
              showTrafficLayer 
                ? 'bg-primary text-white' 
                : 'glass-panel dark:bg-slate-900 text-on-surface-variant dark:text-slate-400'
            }`}
            title="Toggle Traffic Layer"
            aria-label="Toggle Traffic Layer"
          >
            🚦
          </button>

          {/* Zoom controls */}
          <div className="flex items-center space-x-1 glass-panel dark:bg-slate-900/90 p-1 rounded-2xl shadow-md border border-white/80 dark:border-slate-750">
            <button 
              onClick={() => setZoom(prev => Math.min(prev + 0.2, 1.8))}
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg hover:bg-surface-container dark:hover:bg-slate-800 flex items-center justify-center text-primary dark:text-cyan-400 transition-colors"
              title="Zoom In"
              aria-label="Zoom In"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.8))}
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg hover:bg-surface-container dark:hover:bg-slate-800 flex items-center justify-center text-primary dark:text-cyan-400 transition-colors"
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setZoom(1)}
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg hover:bg-surface-container dark:hover:bg-slate-800 flex items-center justify-center text-on-surface-variant dark:text-slate-400 transition-colors"
              title="Reset View"
              aria-label="Reset View"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Bottom Telemetry Inspector Drawer (Bus or Stop) */}
      {showOverlay && showInspector && (
        <div className="absolute bottom-3 left-3 right-3 md:left-auto md:right-3 md:w-88 glass-panel dark:bg-slate-900/95 rounded-2xl p-3.5 sm:p-4 shadow-2xl border border-white/80 dark:border-slate-700/80 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2">
          {/* Close button for inspector overlay */}
          <button 
            onClick={() => setShowInspector(false)}
            className="absolute top-2.5 right-2.5 text-outline dark:text-slate-400 hover:text-on-surface p-1 rounded-lg"
            aria-label="Close telemetry overlay"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {/* If Stop is inspected */}
          {inspectedStop ? (
            <div>
              <div className="flex items-center space-x-2 mb-1.5 pr-6">
                <span className="p-1 rounded-lg bg-primary/10 dark:bg-cyan-500/20 text-primary dark:text-cyan-400">
                  <MapPin className="w-3.5 h-3.5" />
                </span>
                <div>
                  <span className="text-[10px] font-label text-primary dark:text-cyan-400 uppercase font-bold">
                    Station Inspector
                  </span>
                  <h4 className="font-headline font-bold text-xs sm:text-sm text-on-surface dark:text-slate-100 truncate">
                    {inspectedStop.name}
                  </h4>
                </div>
              </div>

              <p className="text-[11px] text-on-surface-variant dark:text-slate-400 mb-2">
                Zone: {inspectedStop.area} • Serving {inspectedStop.connections.join(', ')}
              </p>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-outline-variant/20 dark:border-slate-750">
                <div className="bg-surface-container-low/70 dark:bg-slate-800 p-2 rounded-xl text-center">
                  <span className="text-[9px] uppercase font-label text-outline dark:text-slate-400 block font-bold">Next Bus</span>
                  <span className="font-bold text-xs text-primary dark:text-cyan-400">{inspectedStop.nextBus}</span>
                </div>
                <div className="bg-surface-container-low/70 dark:bg-slate-800 p-2 rounded-xl text-center">
                  <span className="text-[9px] uppercase font-label text-outline dark:text-slate-400 block font-bold">Arriving In</span>
                  <span className="font-bold text-xs text-on-surface dark:text-slate-100">{inspectedStop.nextEta}</span>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* Bus Telemetry Inspector */}
              <div className="flex justify-between items-start mb-2 pr-6">
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[11px] font-headline font-black text-primary dark:text-cyan-400">
                        {activeBus?.number || 'Bus Active'}
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-surface-container dark:bg-slate-800 text-outline">
                        {activeBus?.plate || 'GPS-SYNC'}
                      </span>
                    </div>
                    <h4 className="font-headline font-bold text-xs sm:text-sm text-on-surface dark:text-slate-100 truncate max-w-[200px]">
                      {activeBus?.routeName || 'City Corridor Express'}
                    </h4>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${getStatusColor(activeBus?.status || 'On Time')}`}>
                    {activeBus?.status || 'On Time'}
                  </span>
                </div>

                {/* Next Stop & ETA Banner */}
                <div className="flex items-center justify-between text-[11px] bg-primary/5 dark:bg-slate-800/80 p-2 rounded-xl mb-2 border border-primary/15 dark:border-slate-700">
                  <div className="min-w-0 pr-1 truncate">
                    <span className="text-[9px] uppercase font-label text-outline dark:text-slate-400 block">Next Stop</span>
                    <span className="font-bold text-xs text-on-surface dark:text-slate-100 truncate">{activeBus?.nextStop || 'Station'}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[9px] uppercase font-label text-outline dark:text-slate-400 block">ETA</span>
                    <span className="font-headline font-black text-sm text-primary dark:text-cyan-300">
                      {(activeBus?.trafficAdjustedEtaMinutes ?? 0) > 0 ? `${activeBus.trafficAdjustedEtaMinutes} min` : 'Arrived'}
                    </span>
                  </div>
                </div>

                {/* Speed & Occupancy metrics */}
                <div className="grid grid-cols-3 gap-1.5 text-center pt-1 border-t border-outline-variant/25 dark:border-slate-750">
                  <div className="bg-surface-container-low/70 dark:bg-slate-800/80 rounded-xl py-1 px-1">
                    <span className="text-[9px] font-label text-outline dark:text-slate-400 block uppercase font-bold">Speed</span>
                    <span className="font-headline font-bold text-xs text-on-surface dark:text-slate-100">{activeBus?.speedKmH ?? 40} km/h</span>
                  </div>
                  <div className="bg-surface-container-low/70 dark:bg-slate-800/80 rounded-xl py-1 px-1">
                    <span className="text-[9px] font-label text-outline dark:text-slate-400 block uppercase font-bold">Occupancy</span>
                    <span className={`font-headline font-bold text-xs ${occupancyInfo.color.split(' ')[0]}`}>
                      {activeBus?.occupancyPercent ?? 50}% ({activeBus?.occupancyLevel ?? 'MED'})
                    </span>
                  </div>
                  <div className="bg-surface-container-low/70 dark:bg-slate-800/80 rounded-xl py-1 px-1">
                    <span className="text-[9px] font-label text-outline dark:text-slate-400 block uppercase font-bold">Traffic</span>
                    <span className={`font-headline font-bold text-[10px] ${
                      trafficCondition === 'HIGH' ? 'text-error' : trafficCondition === 'MEDIUM' ? 'text-amber-500' : 'text-emerald-500'
                    }`}>
                      {trafficCondition}
                    </span>
                  </div>
                </div>

                {/* Action Buttons: Favorite & Report */}
                <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-outline-variant/20 dark:border-slate-750 text-xs">
                  <button
                    type="button"
                    onClick={() => activeBus?.id && toggleFavoriteBus(activeBus.id)}
                    className="inline-flex items-center space-x-1 text-primary dark:text-cyan-400 hover:underline font-bold"
                  >
                    <Heart className={`w-3.5 h-3.5 ${activeBus?.id && isFavoriteBus(activeBus.id) ? 'fill-error text-error' : ''}`} />
                    <span>{activeBus?.id && isFavoriteBus(activeBus.id) ? 'Saved' : 'Favorite'}</span>
                  </button>

                <button
                  type="button"
                  onClick={() => setIsIncidentModalOpen(true)}
                  className="text-on-surface-variant dark:text-slate-400 hover:text-error dark:hover:text-red-400 text-[11px] font-semibold"
                >
                  Report Delay
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export const LiveMap = React.memo(LiveMapComponent);
export default LiveMap;
