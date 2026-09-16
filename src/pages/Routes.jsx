import React, { useState, useMemo, useCallback } from 'react';
import {
  Search,
  Bus,
  MapPin,
  Clock,
  ArrowRight,
  ArrowUpDown,
  CheckCircle2,
  Sparkles,
  Activity,
  AlertTriangle,
  AlertCircle,
  Gauge,
  Filter,
  X,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Navigation,
  Repeat,
  Layers,
  Radio,
  Users,
  Check,
  Star,
  ShieldCheck,
  Compass,
  ArrowDown
} from 'lucide-react';
import LiveMap from '../components/LiveMap';
import { useTransit } from '../context/TransitContext';
import { useDebounce } from '../hooks/useDebounce';
import { sanitizeSearchQuery } from '../utils/sanitization';
import { getCrowdBadgeInfo, getCrowdLevel } from '../services/transitData';

export default function Routes({ setCurrentPage }) {
  const {
    routes: contextRoutes,
    buses,
    stops: contextStops,
    trafficCondition,
    setSelectedBusId
  } = useTransit();

  // 1. Fallback / Extended Route Data (Merged with context routes)
  const allStops = useMemo(() => {
    if (contextStops && contextStops.length > 0) return contextStops;
    return [
      { id: 'stop-guindy', name: 'Guindy', area: 'South Hub' },
      { id: 'stop-saidapet', name: 'Saidapet', area: 'Transit Bridge' },
      { id: 'stop-teynampet', name: 'Teynampet', area: 'Arterial Central' },
      { id: 'stop-central', name: 'Central Bus Stand (Chennai Central)', area: 'Metropolitan Terminal' },
      { id: 'stop-market', name: 'Market Square', area: 'Downtown Center' },
      { id: 'stop-civic', name: 'Civic Hub', area: 'Administrative Plaza' },
      { id: 'stop-tech-plaza', name: 'Tech Plaza', area: 'Innovation Sector' },
      { id: 'stop-college', name: 'College Gate Terminal', area: 'University District' },
      { id: 'stop-east', name: 'East Terminal', area: 'Harbor Gateway' },
      { id: 'stop-river', name: 'River Road', area: 'Riverside Walk' }
    ];
  }, [contextStops]);

  // Extended routes enriched with telemetry and detailed stop waypoints
  const allRoutes = useMemo(() => {
    const baseList = [
      {
        id: 'route-21a',
        number: '21A',
        name: 'Guindy to Chennai Central Corridor',
        from: 'Guindy',
        to: 'Central Bus Stand',
        distanceKm: 14.2,
        baseTravelTimeMin: 28,
        stops: ['Guindy', 'Saidapet', 'Teynampet', 'Central Bus Stand (Chennai Central)'],
        assignedBus: 'Bus 21A',
        frequency: 'Every 8 mins',
        detailedStops: [
          { name: 'Guindy Junction', type: 'START', desc: '0.0 km • Departure Terminal', isPassed: true },
          { name: 'Saidapet Hub', type: 'Stop 1', desc: '4.2 km • River Crossing Bridge', isPassed: true },
          { name: 'Teynampet', type: 'Stop 2', desc: '8.1 km • Arterial Corridor', isPassed: false, isCurrent: true, transfer: 'Subway Line 1 Transfer' },
          { name: 'Central Bus Stand (Chennai Central)', type: 'DESTINATION', desc: '14.2 km • Final Metro Terminal', isPassed: false, isTerminal: true }
        ]
      },
      {
        id: 'route-101',
        number: '101',
        name: 'Central to College Terminal',
        from: 'Central Depot',
        to: 'College Campus Terminal',
        distanceKm: 18.4,
        baseTravelTimeMin: 34,
        stops: ['Market Square', 'Civic Hub', 'Tech Plaza', 'College Gate Terminal', 'East Terminal'],
        assignedBus: 'Bus 101',
        frequency: 'Every 10 mins',
        detailedStops: [
          { name: 'Central Depot / Market Square', type: 'START', desc: '0.0 km • Main Metropolitan Departure', isPassed: true },
          { name: 'Civic Hub', type: 'Stop 1', desc: '3.8 km • Administrative Plaza', isPassed: true },
          { name: 'Tech Plaza', type: 'Stop 2', desc: '9.4 km • Innovation District', isPassed: false, isCurrent: true, transfer: 'Transfer to Route 102' },
          { name: 'College Gate Terminal', type: 'Stop 3', desc: '14.6 km • University Campus', isPassed: false },
          { name: 'East Terminal', type: 'DESTINATION', desc: '18.4 km • Harbor Link', isPassed: false, isTerminal: true }
        ]
      },
      {
        id: 'route-102',
        number: '102',
        name: 'Tech Park Express',
        from: 'Financial Hub',
        to: 'Tech Plaza Innovation',
        distanceKm: 12.1,
        baseTravelTimeMin: 22,
        stops: ['Market Square', 'Tech Plaza', 'East Terminal'],
        assignedBus: 'Bus 102',
        frequency: 'Every 12 mins',
        detailedStops: [
          { name: 'Financial Hub / Market Square', type: 'START', desc: '0.0 km • Financial District Plaza', isPassed: true },
          { name: 'Tech Plaza', type: 'Stop 1', desc: '6.2 km • Est. 4 min', isPassed: false, isCurrent: true, transfer: 'Subway Line 2 Transfer' },
          { name: 'East Terminal', type: 'DESTINATION', desc: '12.1 km • Coastal Express Concourse', isPassed: false, isTerminal: true }
        ]
      },
      {
        id: 'route-204',
        number: '204',
        name: 'Riverside Loop',
        from: 'Civic Hub',
        to: 'River Road Marina',
        distanceKm: 9.8,
        baseTravelTimeMin: 25,
        stops: ['Civic Hub', 'River Road', 'Saidapet'],
        assignedBus: 'Bus 204',
        frequency: 'Every 15 mins',
        detailedStops: [
          { name: 'Civic Hub Plaza', type: 'START', desc: '0.0 km • Loop Start Node', isPassed: true },
          { name: 'River Road Marina', type: 'Stop 1', desc: '4.5 km • Riverside Promenade', isPassed: false, isCurrent: true },
          { name: 'Saidapet Return Link', type: 'DESTINATION', desc: '9.8 km • South Transit Hub', isPassed: false, isTerminal: true }
        ]
      },
      {
        id: 'route-402',
        number: '402',
        name: 'Guindy to Airport Express',
        from: 'Guindy',
        to: 'Airport Terminal',
        distanceKm: 11.5,
        baseTravelTimeMin: 20,
        stops: ['Guindy', 'Saidapet', 'Airport Terminal'],
        assignedBus: 'Bus 402',
        frequency: 'Every 10 mins',
        detailedStops: [
          { name: 'Guindy Hub', type: 'START', desc: '0.0 km • South Interchange', isPassed: true },
          { name: 'Saidapet Arterial', type: 'Stop 1', desc: '3.6 km • Highway Concourse', isPassed: false, isCurrent: true },
          { name: 'Airport International Terminal', type: 'DESTINATION', desc: '11.5 km • Departures Gate', isPassed: false, isTerminal: true }
        ]
      }
    ];

    return baseList;
  }, []);

  // 2. From → To State (Default: Guindy → Central Bus Stand)
  const [fromStopName, setFromStopName] = useState('Guindy');
  const [toStopName, setToStopName] = useState('Central Bus Stand (Chennai Central)');
  const [isSwapRotated, setIsSwapRotated] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState('route-21a');
  const [isPlanTriggered, setIsPlanTriggered] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  // 3. Swap Origin and Destination
  const handleSwapStops = useCallback(() => {
    setIsSwapRotated((prev) => !prev);
    setFromStopName(toStopName);
    setToStopName(fromStopName);
  }, [fromStopName, toStopName]);

  // 4. Match and Score Routes based on From and To
  const evaluatedRoutes = useMemo(() => {
    const fromClean = fromStopName.toLowerCase().trim();
    const toClean = toStopName.toLowerCase().trim();

    const scored = allRoutes.map((route) => {
      // Check if route matches assigned bus in live context
      const liveBus =
        buses.find(
          (b) =>
            b.routeId === route.id ||
            b.number.toLowerCase().includes(route.number.toLowerCase()) ||
            (route.assignedBus && b.number.toLowerCase() === route.assignedBus.toLowerCase())
        ) || buses[0];

      // Route stops matching
      const hasFrom =
        route.from.toLowerCase().includes(fromClean) ||
        fromClean.includes(route.from.toLowerCase()) ||
        route.stops.some((s) => s.toLowerCase().includes(fromClean) || fromClean.includes(s.toLowerCase()));

      const hasTo =
        route.to.toLowerCase().includes(toClean) ||
        toClean.includes(route.to.toLowerCase()) ||
        route.stops.some((s) => s.toLowerCase().includes(toClean) || toClean.includes(s.toLowerCase()));

      let matchScore = 0;
      if (hasFrom && hasTo) matchScore += 100;
      else if (hasFrom || hasTo) matchScore += 40;

      // Status bonus
      if (liveBus?.status === 'On Time' || liveBus?.status === 'Approaching') matchScore += 25;
      else if (liveBus?.status === 'Delayed') matchScore -= 10;

      // Seat availability bonus
      const seats = liveBus?.availableSeats ?? 12;
      matchScore += Math.min(20, seats);

      // Travel time factor (faster is better)
      const travelTime = liveBus?.trafficAdjustedEtaMinutes
        ? Math.max(route.baseTravelTimeMin, liveBus.trafficAdjustedEtaMinutes + 15)
        : route.baseTravelTimeMin;

      matchScore -= Math.round(travelTime / 3);

      const crowd = liveBus?.crowdLevel || getCrowdLevel(liveBus?.occupancyPercent ?? 50);
      const crowdInfo = getCrowdBadgeInfo(crowd);

      return {
        ...route,
        liveBus,
        hasDirectMatch: hasFrom && hasTo,
        matchScore,
        travelTimeMin: travelTime,
        availableSeats: seats,
        crowdLevel: crowd,
        crowdInfo,
        busStatus: liveBus?.status || 'On Time'
      };
    });

    // Sort by matchScore descending
    scored.sort((a, b) => b.matchScore - a.matchScore);

    // Apply Filter if active
    return scored.filter((r) => {
      if (activeFilter === 'on-time') return r.busStatus === 'On Time' || r.busStatus === 'Approaching';
      if (activeFilter === 'low-crowd') return r.crowdLevel === 'LOW';
      if (activeFilter === 'seats') return r.availableSeats > 10;
      return true;
    });
  }, [allRoutes, buses, fromStopName, toStopName, activeFilter]);

  // Current Active Route for Map & Details
  const activeRoute = useMemo(() => {
    return evaluatedRoutes.find((r) => r.id === selectedRouteId) || evaluatedRoutes[0] || allRoutes[0];
  }, [evaluatedRoutes, selectedRouteId, allRoutes]);

  // Best Route Recommendation
  const bestRoute = evaluatedRoutes[0];
  const alternativeRoutes = evaluatedRoutes.slice(1);

  // Status Badge Helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delayed':
        return {
          dot: '🟡',
          label: 'DELAYED',
          colorClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800'
        };
      case 'Out of Service':
        return {
          dot: '🔴',
          label: 'SERVICE ISSUE',
          colorClass: 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border-red-300 dark:border-red-800'
        };
      case 'Approaching':
      case 'On Time':
      default:
        return {
          dot: '🟢',
          label: 'ON TIME',
          colorClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
        };
    }
  };

  // Switch to Live Tracking for selected bus
  const handleTrackLiveBus = (busId) => {
    if (busId) setSelectedBusId(busId);
    setCurrentPage('tracking');
  };

  // Popular Route Quick Selection Handler
  const handleSelectPopularRoute = (route) => {
    setFromStopName(route.from);
    setToStopName(route.to);
    setSelectedRouteId(route.id);
  };

  return (
    <main className="pt-20 sm:pt-24 md:pt-28 pb-28 sm:pb-24 lg:pb-20 px-3 sm:px-6 md:px-margin-desktop max-w-container-max mx-auto w-full min-h-screen flex flex-col gap-6 sm:gap-7 overflow-x-hidden text-slate-900 dark:text-slate-100">
      {/* ========================================================================= */}
      {/* 1. PAGE HERO                                                              */}
      {/* ========================================================================= */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200/60 dark:border-blue-900/60 text-primary dark:text-cyan-400 text-[11px] font-label font-bold uppercase tracking-wider mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <span>● LIVE ROUTE NETWORK</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-slate-600 dark:text-slate-300 font-medium">
              {allRoutes.length} Corridors Active
            </span>
          </div>
          <h1 className="font-headline font-extrabold text-2xl sm:text-3xl md:text-4xl text-slate-900 dark:text-slate-100 tracking-tight">
            SMART ROUTE PLANNER
          </h1>
          <p className="font-headline font-semibold text-xs sm:text-sm text-primary dark:text-cyan-400 mt-0.5">
            "Find the best way to your destination."
          </p>
          <p className="font-body text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Compare routes, travel time, stops and crowd levels before you start your journey.
          </p>
        </div>

        {/* Quick Link to Live Tracking */}
        <div className="shrink-0 self-stretch sm:self-auto flex items-center justify-end">
          <button
            type="button"
            onClick={() => setCurrentPage('tracking')}
            className="px-3.5 py-2 rounded-xl text-xs font-label font-bold tracking-wider bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-750 hover:border-primary dark:hover:border-cyan-400 transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Radio className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
            <span>SWITCH TO LIVE BUS RADAR</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. FROM → TO ROUTE SEARCH PLANNER CARD                                    */}
      {/* ========================================================================= */}
      <section className="bg-white dark:bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-headline font-bold text-xs sm:text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-primary dark:text-cyan-400" />
            <span>Plan Your Corridor Journey</span>
          </h2>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
            Real-Time Stop Directory Connected
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* FROM Input */}
          <div className="md:col-span-5 relative">
            <label
              htmlFor="route-from-select"
              className="text-[10px] font-label font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1"
            >
              FROM (Starting Point)
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-primary dark:text-cyan-400 pointer-events-none" />
              <select
                id="route-from-select"
                value={fromStopName}
                onChange={(e) => {
                  setFromStopName(e.target.value);
                  setIsPlanTriggered(true);
                }}
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-8 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:border-primary dark:focus:border-cyan-400 focus:ring-2 focus:ring-primary/10 outline-none transition-all cursor-pointer appearance-none"
              >
                {allStops.map((stop) => (
                  <option key={stop.id} value={stop.name}>
                    {stop.name} {stop.area ? `(${stop.area})` : ''}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* SWAP Button */}
          <div className="md:col-span-2 flex justify-center pt-1 md:pt-4">
            <button
              type="button"
              onClick={handleSwapStops}
              className={`p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750 hover:text-primary dark:hover:text-cyan-400 transition-all shadow-xs ${
                isSwapRotated ? 'rotate-180' : 'rotate-0'
              }`}
              title="Swap From and To stops"
              aria-label="Swap starting point and destination"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>

          {/* TO Input */}
          <div className="md:col-span-5 relative">
            <label
              htmlFor="route-to-select"
              className="text-[10px] font-label font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1"
            >
              TO (Destination)
            </label>
            <div className="relative">
              <CheckCircle2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none" />
              <select
                id="route-to-select"
                value={toStopName}
                onChange={(e) => {
                  setToStopName(e.target.value);
                  setIsPlanTriggered(true);
                }}
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-8 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:border-primary dark:focus:border-cyan-400 focus:ring-2 focus:ring-primary/10 outline-none transition-all cursor-pointer appearance-none"
              >
                {allStops.map((stop) => (
                  <option key={stop.id} value={stop.name}>
                    {stop.name} {stop.area ? `(${stop.area})` : ''}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>Route: </span>
            <strong className="text-slate-900 dark:text-slate-100 font-semibold truncate max-w-[240px] sm:max-w-none">
              {fromStopName.split(' (')[0]} → {toStopName.split(' (')[0]}
            </strong>
          </div>

          <button
            type="button"
            onClick={() => setIsPlanTriggered(true)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-headline font-bold text-xs uppercase tracking-wider bg-primary hover:bg-primary-container text-white shadow-md shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>PLAN MY ROUTE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3 & 4. ROUTE RESULTS, COMPARISON & MAP LAYOUT                             */}
      {/* Desktop: LEFT (Options & Recommendation) | RIGHT (Live Map & Timeline)   */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-7 items-start">
        {/* ----------------------------------------------------------------------- */}
        {/* LEFT COLUMN: ROUTE RESULTS & SMART RECOMMENDATION (5 cols on Desktop)   */}
        {/* ----------------------------------------------------------------------- */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Section Header with Quick Filters */}
          <div className="flex items-center justify-between">
            <h2 className="font-headline font-black text-lg text-slate-900 dark:text-slate-100 tracking-tight">
              AVAILABLE ROUTES
            </h2>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {evaluatedRoutes.length} Options Found
            </span>
          </div>

          {/* Quick Filters for Route Results */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 hide-scrollbar">
            {[
              { id: 'all', label: 'All Options' },
              { id: 'on-time', label: '🟢 On Time' },
              { id: 'low-crowd', label: '🟢 Low Crowd' },
              { id: 'seats', label: '🪑 10+ Seats' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeFilter === f.id
                    ? 'bg-primary text-white'
                    : 'bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-750'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* 6. SMART RECOMMENDATION PANEL */}
          {bestRoute && (
            <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-slate-850 dark:via-slate-800 dark:to-cyan-950/30 border border-blue-200/80 dark:border-cyan-500/30 shadow-sm flex items-start gap-3 animate-in fade-in duration-300">
              <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="w-4 h-4 text-cyan-300" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-label font-bold uppercase tracking-wider text-primary dark:text-cyan-400">
                    SMART RECOMMENDATION
                  </span>
                  <span className="text-[9px] font-mono text-slate-400">Simulated AI Telemetry</span>
                </div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1 leading-snug">
                  "Bus {bestRoute.number} is currently the fastest option with {bestRoute.crowdInfo.label.toLowerCase()} crowd level and {bestRoute.availableSeats} available seats."
                </p>
              </div>
            </div>
          )}

          {/* BEST OPTION CARD */}
          {bestRoute && (
            <div
              onClick={() => setSelectedRouteId(bestRoute.id)}
              className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 relative group flex flex-col gap-3 ${
                selectedRouteId === bestRoute.id
                  ? 'bg-blue-50/40 dark:bg-slate-850 border-primary dark:border-cyan-400 shadow-md ring-2 ring-primary/10'
                  : 'bg-white dark:bg-slate-900/90 border-blue-300/80 dark:border-cyan-500/40 hover:border-primary shadow-xs'
              }`}
            >
              {/* Highlight Ribbon */}
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-primary text-white text-[10px] font-label font-black uppercase tracking-wider shadow-xs flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current text-cyan-300" />
                  BEST OPTION
                </span>

                {(() => {
                  const badge = getStatusBadge(bestRoute.busStatus);
                  return (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badge.colorClass}`}>
                      {badge.dot} {badge.label}
                    </span>
                  );
                })()}
              </div>

              {/* Bus & Corridor */}
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-headline font-black text-base sm:text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Bus className="w-4 h-4 text-primary dark:text-cyan-400" />
                    <span>Bus {bestRoute.number}</span>
                  </h3>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {bestRoute.frequency}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
                  {bestRoute.from} → {bestRoute.to}
                </p>
              </div>

              {/* Telemetry Micro Grid */}
              <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] font-label uppercase text-slate-400 block font-semibold">
                    Travel Time
                  </span>
                  <span className="font-headline font-bold text-slate-900 dark:text-slate-100">
                    ⏱ {bestRoute.travelTimeMin} min
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-label uppercase text-slate-400 block font-semibold">
                    Stops
                  </span>
                  <span className="font-headline font-bold text-slate-900 dark:text-slate-100">
                    🚏 {bestRoute.stops.length} stops
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-label uppercase text-slate-400 block font-semibold">
                    Seats
                  </span>
                  <span className="font-headline font-bold text-primary dark:text-cyan-400">
                    🪑 {bestRoute.availableSeats} seats
                  </span>
                </div>
              </div>

              {/* Crowd & View Route Action */}
              <div className="flex items-center justify-between pt-0.5">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${bestRoute.crowdInfo.colorClass}`}>
                  {bestRoute.crowdInfo.label} crowd
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedRouteId(bestRoute.id);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container transition-colors flex items-center gap-1 shadow-xs"
                >
                  <span>VIEW ROUTE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ALTERNATIVE ROUTES */}
          {alternativeRoutes.length > 0 && (
            <div className="flex flex-col gap-3">
              <span className="text-xs font-label font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Alternative Route Options ({alternativeRoutes.length})
              </span>

              {alternativeRoutes.map((alt) => {
                const isSelected = selectedRouteId === alt.id;
                const badge = getStatusBadge(alt.busStatus);

                return (
                  <div
                    key={alt.id}
                    onClick={() => setSelectedRouteId(alt.id)}
                    className={`p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col gap-2.5 ${
                      isSelected
                        ? 'bg-blue-50/40 dark:bg-slate-850 border-primary dark:border-cyan-400 shadow-sm'
                        : 'bg-white dark:bg-slate-900/90 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[9px] font-label font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          ALTERNATIVE
                        </span>
                        <h4 className="font-headline font-black text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1">
                          <Bus className="w-3.5 h-3.5 text-primary dark:text-cyan-400" />
                          <span>Bus {alt.number}</span>
                        </h4>
                      </div>

                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${badge.colorClass}`}>
                        {badge.dot} {badge.label}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                      {alt.from} → {alt.to}
                    </p>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                      <span>⏱ {alt.travelTimeMin} min • 🚏 {alt.stops.length} stops</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        🪑 {alt.availableSeats} seats • {alt.crowdInfo.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* RIGHT COLUMN: ROUTE MAP & DETAILED VERTICAL STOPS TIMELINE (7 cols)     */}
        {/* ----------------------------------------------------------------------- */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* 5. ROUTE MAP */}
          <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-3 border border-slate-200/80 dark:border-slate-800 shadow-md">
            {/* Map Header Ribbon */}
            <div className="px-2 py-1.5 flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="font-headline font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                  {activeRoute.number} Route Visualization Map
                </span>
              </div>
              <span className="text-[10px] font-label font-bold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 uppercase">
                Simulated Live GPS
              </span>
            </div>

            {/* Interactive Vector Map Canvas */}
            <LiveMap
              selectedBus={activeRoute.liveBus?.id || activeRoute.assignedBus || 'Bus 21A'}
              routeName={activeRoute.name}
              height="h-[280px] sm:h-[340px] lg:h-[360px]"
              showOverlay={false}
              onBusSelect={(bus) => setSelectedBusId(bus.id)}
            />

            {/* Map Legend Strip */}
            <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1 gap-2">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">📍 Start: <strong>{activeRoute.from}</strong></span>
                <span>•</span>
                <span className="flex items-center gap-1">🏁 Destination: <strong>{activeRoute.to}</strong></span>
              </div>
              <button
                type="button"
                onClick={() => handleTrackLiveBus(activeRoute.liveBus?.id)}
                className="text-primary dark:text-cyan-400 font-bold hover:underline flex items-center gap-1"
              >
                <span>Track on Live Radar</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* 7. ROUTE DETAILS & VERTICAL STOPS TIMELINE */}
          <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-md flex flex-col gap-4">
            {/* Header / Summary Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-label font-bold uppercase tracking-wider text-primary dark:text-cyan-400 block">
                  Route Details
                </span>
                <h3 className="font-headline font-black text-lg sm:text-xl text-slate-900 dark:text-slate-100">
                  Bus {activeRoute.number} • {activeRoute.name}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  ⏱ {activeRoute.travelTimeMin} min
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-primary dark:text-cyan-400 border border-blue-200 dark:border-blue-900">
                  {activeRoute.distanceKm} km
                </span>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-750/60">
                <span className="text-[9px] font-label font-bold uppercase text-slate-400 block">Status</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">
                  {activeRoute.busStatus}
                </span>
              </div>

              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-750/60">
                <span className="text-[9px] font-label font-bold uppercase text-slate-400 block">Crowd</span>
                <span className="font-bold text-amber-600 dark:text-amber-400 mt-0.5 block">
                  {activeRoute.crowdInfo.label}
                </span>
              </div>

              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-750/60">
                <span className="text-[9px] font-label font-bold uppercase text-slate-400 block">Available Seats</span>
                <span className="font-black text-primary dark:text-cyan-400 mt-0.5 block">
                  {activeRoute.availableSeats} seats
                </span>
              </div>

              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-750/60">
                <span className="text-[9px] font-label font-bold uppercase text-slate-400 block">Next Bus</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">
                  ~{activeRoute.liveBus?.trafficAdjustedEtaMinutes || 7} min
                </span>
              </div>
            </div>

            {/* VERTICAL TIMELINE OF STOPS */}
            <div className="mt-2">
              <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                Corridor Stations Progression
              </h4>

              <div className="relative pl-6 space-y-4">
                {/* Continuous Blue to Cyan Gradient Line */}
                <div className="absolute left-[11px] top-2 bottom-2 w-[3px] rounded-full bg-gradient-to-b from-[#0050cb] via-[#0066ff] to-[#00ffff]" />

                {activeRoute.detailedStops.map((stop, i) => {
                  const isStart = stop.type === 'START';
                  const isDestination = stop.type === 'DESTINATION';
                  const isCurrent = stop.isCurrent;

                  return (
                    <div key={i} className="relative group">
                      {/* Waypoint Dot */}
                      <div
                        className={`absolute -left-[23px] top-1.5 w-4 h-4 rounded-full flex items-center justify-center border-2 transition-all ${
                          isCurrent
                            ? 'bg-cyan-400 border-white dark:border-slate-900 ring-4 ring-cyan-400/30 animate-pulse'
                            : isStart
                            ? 'bg-primary border-white dark:border-slate-900'
                            : isDestination
                            ? 'bg-emerald-500 border-white dark:border-slate-900'
                            : 'bg-white dark:bg-slate-800 border-primary dark:border-cyan-400'
                        }`}
                      >
                        <div
                          className={`w-1 h-1 rounded-full ${
                            isCurrent || isDestination ? 'bg-slate-900' : 'bg-white'
                          }`}
                        />
                      </div>

                      {/* Stop Info Card */}
                      <div
                        className={`p-3 rounded-xl border text-xs transition-all ${
                          isCurrent
                            ? 'bg-blue-50/70 dark:bg-slate-800/80 border-cyan-400 shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200/60 dark:border-slate-750/70'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[9px] font-label font-bold uppercase tracking-wider ${
                                isStart
                                  ? 'bg-primary text-white'
                                  : isDestination
                                  ? 'bg-emerald-600 text-white'
                                  : isCurrent
                                  ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-black'
                                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                              }`}
                            >
                              {stop.type}
                            </span>
                            <strong
                              className={`font-semibold ${
                                isCurrent
                                  ? 'text-primary dark:text-cyan-300 font-bold'
                                  : 'text-slate-900 dark:text-slate-100'
                              }`}
                            >
                              {stop.name}
                            </strong>
                          </div>

                          {isCurrent && (
                            <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                              Next Stop
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                          {stop.desc}
                        </p>

                        {stop.transfer && (
                          <div className="mt-1.5 text-[10px] bg-blue-100/60 dark:bg-blue-950/40 text-primary dark:text-cyan-300 border border-blue-200 dark:border-blue-900/60 px-2 py-0.5 rounded inline-flex items-center gap-1 font-medium">
                            <Repeat className="w-2.5 h-2.5 text-cyan-500 shrink-0" />
                            <span>{stop.transfer}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Action: Switch to Live Bus Radar */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleTrackLiveBus(activeRoute.liveBus?.id)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs bg-primary hover:bg-primary-container text-white shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Track Bus {activeRoute.number} on Live Radar</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
                Live Telemetry Synchronized
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 9. POPULAR ROUTES SECTION                                                 */}
      {/* ========================================================================= */}
      <section className="mt-2 bg-white dark:bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="font-headline font-black text-sm sm:text-base text-slate-900 dark:text-slate-100 tracking-tight">
              POPULAR ROUTES
            </h2>
            <span className="text-[10px] font-label font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-primary dark:text-cyan-400 border border-blue-200 dark:border-blue-900">
              Frequently Traveled
            </span>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
            Click any line to load instant route plan
          </span>
        </div>

        {/* Horizontal Popular Route Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {allRoutes.slice(0, 4).map((popRoute) => {
            const isSelected = selectedRouteId === popRoute.id;

            return (
              <div
                key={popRoute.id}
                onClick={() => handleSelectPopularRoute(popRoute)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'bg-blue-50/50 dark:bg-slate-850 border-primary dark:border-cyan-400 ring-2 ring-primary/20'
                    : 'bg-slate-50/70 dark:bg-slate-800/50 border-slate-200/60 dark:border-slate-750/70 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-headline font-black text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <Bus className="w-3.5 h-3.5 text-primary dark:text-cyan-400" />
                    <span>Line {popRoute.number}</span>
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                    ⏱ {popRoute.baseTravelTimeMin}m
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold truncate">
                  {popRoute.from} → {popRoute.to}
                </p>

                <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-200/50 dark:border-slate-750/60 text-slate-500 dark:text-slate-400">
                  <span>{popRoute.stops.length} Corridor Stops</span>
                  <span className="font-bold text-primary dark:text-cyan-400 flex items-center gap-0.5">
                    <span>Select</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
