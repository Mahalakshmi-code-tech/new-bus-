import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Search,
  Bus,
  MapPin,
  Clock,
  Users,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  Heart,
  Star,
  Bell,
  Gauge,
  Activity,
  Compass,
  ArrowRight,
  Sparkles,
  X,
  ChevronDown,
  ChevronUp,
  Fuel,
  Radio,
  Share2,
  Layers,
  Volume2,
  SlidersHorizontal,
  Info,
  ShieldCheck
} from 'lucide-react';
import LiveMap from '../components/LiveMap';
import SmartStopAlert from '../components/SmartStopAlert';
import { useTransit } from '../context/TransitContext';
import { useDebounce } from '../hooks/useDebounce';
import { sanitizeSearchQuery } from '../utils/sanitization';
import {
  getOccupancyBadge,
  getCrowdLevel,
  getCrowdBadgeInfo,
  getSmartPassengerSuggestion
} from '../services/transitData';

export default function LiveTracking({ setCurrentPage }) {
  const {
    buses,
    selectedBus,
    selectedBusId,
    setSelectedBusId,
    routes,
    stops,
    trafficCondition,
    isDemoSimulation,
    setIsDemoSimulation,
    destinationAlertStopId,
    setDestinationAlertStopId,
    activeStopAlert,
    dismissStopAlert,
    isFavoriteBus,
    toggleFavoriteBus,
    isFavoriteRoute,
    toggleFavoriteRoute,
    setIsIncidentModalOpen
  } = useTransit();

  // 1. Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 180);
  const [selectedRouteFilter, setSelectedRouteFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'DELAYED'
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  // 2. Smart Stop Alert Card Expand/Collapse
  const [isAlertExpanded, setIsAlertExpanded] = useState(false);

  // 3. Smart Toast Notifications Queue
  const [smartToasts, setSmartToasts] = useState([]);

  const addSmartToast = useCallback((toast) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast = { id, ...toast };
    setSmartToasts((prev) => [newToast, ...prev.slice(0, 1)]);

    setTimeout(() => {
      setSmartToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeSmartToast = useCallback((id) => {
    setSmartToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // 4. Monitor Telemetry Changes for Smart Notifications
  useEffect(() => {
    if (!selectedBus) return;

    if (selectedBus.status === 'At Stop') {
      addSmartToast({
        type: 'arrival',
        icon: MapPin,
        title: 'Bus Reached Stop',
        message: `${selectedBus.number} arrived at ${selectedBus.currentStop}.`,
        badgeColor: 'bg-emerald-500'
      });
    }

    if (selectedBus.status === 'Delayed') {
      addSmartToast({
        type: 'delay',
        icon: AlertTriangle,
        title: 'Traffic Delay Detected',
        message: `Congestion on ${selectedBus.routeName}. Delay ~${selectedBus.trafficAdjustedEtaMinutes - selectedBus.normalEtaMinutes} min.`,
        badgeColor: 'bg-amber-500'
      });
    }
  }, [selectedBus?.currentStop, selectedBus?.status, addSmartToast]);

  // 5. Filtered Fleet Calculation
  const filteredBuses = useMemo(() => {
    const clean = sanitizeSearchQuery(debouncedSearch).toLowerCase().trim();

    return buses.filter((bus) => {
      const matchesSearch =
        !clean ||
        bus.number.toLowerCase().includes(clean) ||
        bus.routeName.toLowerCase().includes(clean) ||
        bus.destination.toLowerCase().includes(clean) ||
        bus.plate.toLowerCase().includes(clean) ||
        bus.currentStop?.toLowerCase().includes(clean) ||
        bus.nextStop?.toLowerCase().includes(clean);

      const matchesRoute =
        selectedRouteFilter === 'ALL' ||
        bus.routeId === selectedRouteFilter ||
        bus.number.toLowerCase().includes(selectedRouteFilter.toLowerCase());

      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && bus.status !== 'Out of Service') ||
        (statusFilter === 'DELAYED' && bus.status === 'Delayed');

      return matchesSearch && matchesRoute && matchesStatus;
    });
  }, [buses, debouncedSearch, selectedRouteFilter, statusFilter]);

  // 6. Active Route and Stops for selected bus
  const currentRoute = useMemo(() => {
    if (!selectedBus) return routes[0];
    return routes.find((r) => r.id === selectedBus.routeId || r.number === selectedBus.number) || routes[0];
  }, [selectedBus, routes]);

  const destinationStopObject = useMemo(() => {
    return stops.find((s) => s.id === destinationAlertStopId) || stops[0];
  }, [stops, destinationAlertStopId]);

  // Occupancy & Crowd Calculations
  const currentOccupancy = selectedBus?.occupancyPercent ?? 60;
  const currentCrowdLevel = selectedBus?.crowdLevel || getCrowdLevel(currentOccupancy);
  const currentCrowdBadge = getCrowdBadgeInfo(currentCrowdLevel);
  const currentAvailableSeats = selectedBus?.availableSeats ?? Math.max(0, (selectedBus?.totalSeats || 45) - Math.round(((selectedBus?.totalCapacity || 60) * currentOccupancy) / 100));
  const currentStandingPassengers = selectedBus?.standingPassengers ?? Math.max(0, Math.round(((selectedBus?.totalCapacity || 60) * currentOccupancy) / 100) - (selectedBus?.totalSeats || 45));
  const smartSuggestion = getSmartPassengerSuggestion(currentCrowdLevel, currentAvailableSeats);

  // Status badge styling helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'On Time':
        return { label: '● On Time', colorClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' };
      case 'Approaching':
        return { label: '● Approaching', colorClass: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800' };
      case 'Delayed':
        return { label: '● Delayed', colorClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800' };
      case 'At Stop':
        return { label: '● At Stop', colorClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800' };
      case 'Out of Service':
      default:
        return { label: '● Offline', colorClass: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700' };
    }
  };

  const selectedBusBadge = getStatusBadge(selectedBus?.status);
  const isBusActive = selectedBus?.status !== 'Out of Service';

  // Format route string "A to B" -> "A → B"
  const formattedRouteName = useMemo(() => {
    if (!selectedBus?.routeName) return 'Guindy → Chennai Central';
    return selectedBus.routeName.replace(/\s+to\s+/i, ' → ');
  }, [selectedBus?.routeName]);

  // Count active live buses
  const liveFleetCount = useMemo(() => {
    return buses.filter((b) => b.status !== 'Out of Service').length;
  }, [buses]);

  return (
    <main className="pt-20 sm:pt-24 md:pt-28 pb-28 sm:pb-24 lg:pb-20 px-3 sm:px-6 md:px-margin-desktop max-w-container-max mx-auto w-full min-h-screen flex flex-col gap-5 sm:gap-6 overflow-x-hidden text-slate-900 dark:text-slate-100">
      {/* 1. Proximity Stop Alert Popup (Fires when bus is near destination) */}
      <SmartStopAlert
        alert={activeStopAlert}
        onDismiss={dismissStopAlert}
        busNumber={selectedBus?.number}
      />

      {/* Floating Smart Notifications Stack (Auto-dismiss, bottom-left) */}
      <div className="fixed bottom-20 sm:bottom-6 left-3 sm:left-6 z-40 flex flex-col gap-2.5 pointer-events-none max-w-sm w-full">
        {smartToasts.map((toast) => {
          const Icon = toast.icon;
          return (
            <div
              key={toast.id}
              className="pointer-events-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 flex items-start gap-3 animate-in fade-in slide-in-from-left-4 duration-300"
            >
              <div className={`p-2 rounded-xl text-white shrink-0 ${toast.badgeColor || 'bg-primary'}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0 pr-1">
                <h4 className="font-headline font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate">
                  {toast.title}
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => removeSmartToast(toast.id)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-lg shrink-0"
                aria-label="Dismiss toast"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 2. COMPACT PAGE HERO                                                      */}
      {/* ========================================================================= */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200/60 dark:border-blue-900/60 text-primary dark:text-cyan-400 text-[11px] font-label font-bold uppercase tracking-wider mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <span>● LIVE NETWORK</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-slate-600 dark:text-slate-300 font-medium">
              {liveFleetCount} Buses En Route
            </span>
          </div>
          <h1 className="font-headline font-extrabold text-2xl sm:text-3xl md:text-4xl text-slate-900 dark:text-slate-100 tracking-tight">
            LIVE TRANSIT TRACKING
          </h1>
          <p className="font-body text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Track buses, routes and arrival times in real time.
          </p>
        </div>

        {/* Telemetry Mode Toggle & Report Delay Button */}
        <div className="flex items-center gap-2 shrink-0 self-stretch sm:self-auto justify-between sm:justify-end">
          <button
            type="button"
            onClick={() => setIsDemoSimulation(!isDemoSimulation)}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-label font-bold tracking-wider border transition-all flex items-center gap-1.5 ${
              isDemoSimulation
                ? 'bg-cyan-50 dark:bg-cyan-950/40 text-primary dark:text-cyan-300 border-cyan-300 dark:border-cyan-800 shadow-xs'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
            }`}
            title="Toggle between Demo Simulation and Real GPS mode"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-500 dark:text-cyan-400" />
            <span>{isDemoSimulation ? 'LIVE SIMULATION' : 'REAL GPS'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsIncidentModalOpen(true)}
            className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-body font-semibold bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-750 hover:border-amber-400 dark:hover:border-amber-500 hover:text-amber-600 transition-all flex items-center gap-1.5 shadow-xs"
            title="Report a route incident or delay"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>Report Delay</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. COMPACT SEARCH & QUICK ROUTE FILTER                                    */}
      {/* ========================================================================= */}
      <section className="bg-white dark:bg-slate-900/90 rounded-2xl p-3 sm:p-3.5 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Search Trigger / Input */}
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchExpanded(true)}
              placeholder="Search bus number, route or stop (e.g. 21A, Central, Saidapet)..."
              className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl py-2 pl-9 pr-8 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:border-primary dark:focus:border-cyan-400 focus:ring-2 focus:ring-primary/10 dark:focus:ring-cyan-400/20 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg"
                aria-label="Clear search input"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Route Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar shrink-0">
            <button
              onClick={() => setSelectedRouteFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                selectedRouteFilter === 'ALL'
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              All Routes
            </button>
            {routes.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRouteFilter(r.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedRouteFilter === r.id
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Line {r.number}
              </button>
            ))}
          </div>
        </div>

        {/* Live Search Match Counter */}
        {searchQuery && (
          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>
              Found <strong>{filteredBuses.length}</strong> buses matching "<strong>{searchQuery}</strong>"
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedRouteFilter('ALL');
              }}
              className="text-primary dark:text-cyan-400 font-semibold hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 4. MAIN TRACKING AREA: LARGE 2-COLUMN LAYOUT                              */}
      {/* LEFT: Live Map (~68% on Desktop)                                          */}
      {/* RIGHT: Selected Bus Information & Compact Status (~32% on Desktop)        */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* ----------------------------------------------------------------------- */}
        {/* LEFT COLUMN: THE LIVE MAP (MAIN VISUAL FOCUS ~68%)                      */}
        {/* ----------------------------------------------------------------------- */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-2.5 sm:p-3 border border-slate-200/80 dark:border-slate-800 shadow-md relative overflow-hidden">
            {/* Map Header Ribbon */}
            <div className="px-2 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2 mb-2">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="font-headline font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 tracking-tight">
                  {selectedBus?.number || 'Bus Fleet'} Live Tracking
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {selectedBus?.plate}
                </span>
              </div>

              <div className="flex items-center space-x-3 text-xs text-slate-600 dark:text-slate-300">
                <span className="hidden sm:inline">
                  Route: <strong className="text-primary dark:text-cyan-400">{currentRoute?.number}</strong>
                </span>

                {/* Traffic Badge */}
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    trafficCondition === 'HIGH'
                      ? 'bg-red-50 dark:bg-red-950/50 text-red-600 border-red-200 dark:border-red-900'
                      : trafficCondition === 'MEDIUM'
                      ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 border-amber-200 dark:border-amber-900'
                      : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 border-emerald-200 dark:border-emerald-900'
                  }`}
                >
                  🚦 Traffic: {trafficCondition}
                </span>

                {/* Favorite Route Button */}
                <button
                  onClick={() => currentRoute && toggleFavoriteRoute(currentRoute.id)}
                  className="hover:text-amber-500 transition-colors p-1"
                  title={currentRoute && isFavoriteRoute(currentRoute.id) ? 'Route saved in favorites' : 'Favorite this route'}
                  aria-label="Toggle favorite route"
                >
                  <Star
                    className={`w-4 h-4 ${
                      currentRoute && isFavoriteRoute(currentRoute.id)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-400 hover:text-amber-400'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Interactive Vector Map Canvas (Generous height for command center focus) */}
            <LiveMap
              selectedBus={selectedBus?.id}
              routeName={currentRoute?.name}
              destinationStopId={destinationAlertStopId}
              height="h-[380px] sm:h-[480px] lg:h-[540px] xl:h-[580px]"
              showOverlay={false}
              onBusSelect={(bus) => setSelectedBusId(bus.id)}
            />

            {/* Command Center Quick Map Bar */}
            <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                  <Activity className="w-3.5 h-3.5 text-primary dark:text-cyan-400" />
                  GPS Telemetry Active
                </span>
                <span>•</span>
                <span>Signal: 98% Strong</span>
              </div>
              <div className="flex items-center gap-3">
                <span>Click any bus marker on map to switch live telemetry</span>
              </div>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* RIGHT COLUMN: SELECTED BUS INFORMATION & COMPACT STATUS ROW (~32%)     */}
        {/* ----------------------------------------------------------------------- */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Selected Bus Information Panel */}
          <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-md flex flex-col gap-3.5">
            {/* Bus Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-headline font-black text-xl sm:text-2xl text-slate-900 dark:text-slate-100 tracking-tight">
                    {selectedBus?.number || 'BUS 21A'}
                  </h2>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    LIVE
                  </span>
                </div>
                <p className="text-xs font-semibold text-primary dark:text-cyan-400 mt-0.5">
                  {formattedRouteName}
                </p>
              </div>

              {/* Actions: Save & Share */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => selectedBus && toggleFavoriteBus(selectedBus.id)}
                  className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-750 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-red-500 transition-colors"
                  title={selectedBus && isFavoriteBus(selectedBus.id) ? 'Favorited' : 'Save bus'}
                  aria-label="Toggle favorite bus"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      selectedBus && isFavoriteBus(selectedBus.id)
                        ? 'fill-red-500 text-red-500'
                        : ''
                    }`}
                  />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (navigator.share) {
                      navigator
                        .share({
                          title: `SmartBus Live: ${selectedBus?.number}`,
                          text: `Tracking ${selectedBus?.number} on route ${formattedRouteName}. ETA: ${selectedBus?.trafficAdjustedEtaMinutes} min.`,
                          url: window.location.href
                        })
                        .catch(() => {});
                    } else {
                      navigator.clipboard?.writeText(window.location.href);
                      addSmartToast({
                        type: 'share',
                        icon: Share2,
                        title: 'Link Copied',
                        message: 'Tracking link copied to clipboard.',
                        badgeColor: 'bg-primary'
                      });
                    }
                  }}
                  className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-750 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-300 transition-colors"
                  title="Share tracking link"
                  aria-label="Share tracking link"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Prominent ETA Display Banner */}
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-blue-50/80 via-white to-cyan-50/50 dark:from-slate-850 dark:via-slate-800 dark:to-cyan-950/30 border border-blue-200/60 dark:border-slate-700/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-label font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  Estimated Arrival Time
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-300">
                  {selectedBus?.trafficAdjustedEtaMinutes > 0 ? 'Approaching station' : 'At platform'}
                </span>
              </div>
              <div className="text-right">
                <span className="font-headline font-black text-2xl sm:text-3xl text-primary dark:text-cyan-400 tracking-tight block">
                  {selectedBus?.trafficAdjustedEtaMinutes > 0
                    ? `${selectedBus.trafficAdjustedEtaMinutes} min`
                    : 'Arrived'}
                </span>
              </div>
            </div>

            {/* Journey Waypoints List */}
            <div className="flex flex-col gap-2 text-xs">
              {/* Current Location */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-750/70 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-primary dark:text-cyan-400 shrink-0">
                    <MapPin className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <span className="text-[10px] font-label uppercase tracking-wider text-slate-400 dark:text-slate-500 block font-semibold">
                      Current Location
                    </span>
                    <strong className="text-slate-900 dark:text-slate-100 font-semibold">
                      {selectedBus?.currentStop || 'Guindy'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Next Stop */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-750/70 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400 shrink-0">
                    <Navigation className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <span className="text-[10px] font-label uppercase tracking-wider text-slate-400 dark:text-slate-500 block font-semibold">
                      Next Stop
                    </span>
                    <strong className="text-slate-900 dark:text-slate-100 font-semibold">
                      {selectedBus?.nextStop || 'Saidapet'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Destination */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-750/70 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <span className="text-[10px] font-label uppercase tracking-wider text-slate-400 dark:text-slate-500 block font-semibold">
                      Destination
                    </span>
                    <strong className="text-slate-900 dark:text-slate-100 font-semibold truncate max-w-[170px] block">
                      {selectedBus?.destination || 'Central Bus Stand'}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Distance & Stops Remaining 2-Col Strip */}
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-750/70 text-center">
                <span className="text-[10px] font-label uppercase font-bold text-slate-400 dark:text-slate-500 block mb-0.5">
                  Distance Remaining
                </span>
                <p className="font-headline font-black text-sm text-slate-900 dark:text-slate-100">
                  {selectedBus?.distanceRemainingKm ? `${selectedBus.distanceRemainingKm} km` : '6.7 km'}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-750/70 text-center">
                <span className="text-[10px] font-label uppercase font-bold text-slate-400 dark:text-slate-500 block mb-0.5">
                  Stops Remaining
                </span>
                <p className="font-headline font-black text-sm text-primary dark:text-cyan-400">
                  {selectedBus?.stopsRemaining ? `${selectedBus.stopsRemaining}` : '2'}
                </p>
              </div>
            </div>

            {/* ----------------------------------------------------------------- */}
            {/* 4. COMPACT STATUS TILES                                          */}
            {/* ----------------------------------------------------------------- */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-2.5">
              <span className="text-[10px] font-label font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                Vehicle Telemetry & Status
              </span>

              {/* Telemetry Row 1: Speed, Heading, Engine, Tracking (4 compact tiles) */}
              <div className="grid grid-cols-4 gap-1.5 text-center">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-750/60">
                  <span className="text-[9px] font-label font-bold uppercase text-slate-400 dark:text-slate-500 block">
                    Speed
                  </span>
                  <p className="font-headline font-bold text-xs text-slate-900 dark:text-slate-100 mt-0.5">
                    {selectedBus?.speedKmH ?? 24} km/h
                  </p>
                </div>

                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-750/60">
                  <span className="text-[9px] font-label font-bold uppercase text-slate-400 dark:text-slate-500 block">
                    Heading
                  </span>
                  <p className="font-headline font-bold text-xs text-slate-900 dark:text-slate-100 mt-0.5">
                    {selectedBus?.headingDeg ?? 60}° NNE
                  </p>
                </div>

                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-750/60">
                  <span className="text-[9px] font-label font-bold uppercase text-slate-400 dark:text-slate-500 block">
                    Engine
                  </span>
                  <p className="font-headline font-bold text-xs text-emerald-600 dark:text-emerald-400 mt-0.5 truncate">
                    {selectedBus?.fuelType?.split(' ')[0] || 'Electric'}
                  </p>
                </div>

                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-750/60">
                  <span className="text-[9px] font-label font-bold uppercase text-slate-400 dark:text-slate-500 block">
                    Tracking
                  </span>
                  <p className="font-headline font-bold text-xs text-primary dark:text-cyan-400 mt-0.5 truncate">
                    {isDemoSimulation ? 'Sim GPS' : 'Real GPS'}
                  </p>
                </div>
              </div>

              {/* Telemetry Row 2: Available Seats, Occupancy, Crowd (3 compact tiles) */}
              <div className="grid grid-cols-3 gap-1.5 text-center">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-750/60">
                  <span className="text-[9px] font-label font-bold uppercase text-slate-400 dark:text-slate-500 block">
                    Seats
                  </span>
                  <p className="font-headline font-black text-sm text-primary dark:text-cyan-400 mt-0.5">
                    {currentAvailableSeats}
                  </p>
                  <span className="text-[8px] text-slate-400 block">available</span>
                </div>

                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-750/60">
                  <span className="text-[9px] font-label font-bold uppercase text-slate-400 dark:text-slate-500 block">
                    Occupancy
                  </span>
                  <p className="font-headline font-black text-sm text-slate-900 dark:text-slate-100 mt-0.5">
                    {currentOccupancy}%
                  </p>
                  <span className="text-[8px] text-slate-400 block">capacity</span>
                </div>

                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-750/60">
                  <span className="text-[9px] font-label font-bold uppercase text-slate-400 dark:text-slate-500 block">
                    Crowd
                  </span>
                  <p className="font-headline font-bold text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                    {currentCrowdBadge.label || 'Moderate'}
                  </p>
                  <span className="text-[8px] text-slate-400 block">level</span>
                </div>
              </div>

              {/* Capacity Load Progress Meter */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-750/60 flex flex-col gap-1">
                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                  <span>Passenger Load Bar</span>
                  <span className="font-bold">{currentOccupancy}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden flex">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      currentOccupancy >= 80
                        ? 'bg-red-500'
                        : currentOccupancy >= 50
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(5, currentOccupancy))}%` }}
                  />
                </div>
              </div>

              {/* Commuter Suggestion Callout */}
              <div className="p-2.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-900/40 text-slate-700 dark:text-slate-300 flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-primary dark:text-cyan-400 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-snug">
                  {smartSuggestion}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. SMART STOP ALERT: COMPACT EXPANDABLE CARD BELOW MAIN TRACKING          */}
      {/* ========================================================================= */}
      <section className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden transition-all">
        {/* Collapsed Header Bar */}
        <div
          onClick={() => setIsAlertExpanded(!isAlertExpanded)}
          className="p-3.5 sm:p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-855/50 transition-colors select-none"
        >
          <div className="flex items-center space-x-3">
            <span className="p-2 rounded-xl bg-cyan-100 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 shrink-0">
              <Bell className="w-4 h-4 animate-bounce" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                  Smart Stop Alert
                </h3>
                <span className="text-[10px] font-label font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 uppercase">
                  ● Armed
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Target: <strong className="text-slate-700 dark:text-slate-200">{destinationStopObject?.name?.split(' (')[0] || 'Central Bus Stand'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-primary dark:text-cyan-400 hidden sm:inline">
              {isAlertExpanded ? 'Hide Settings' : 'Configure Stop'}
            </span>
            <button
              type="button"
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              aria-label={isAlertExpanded ? 'Collapse smart stop alert' : 'Expand smart stop alert'}
            >
              {isAlertExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Expanded Configuration Panel */}
        {isAlertExpanded && (
          <div className="px-4 pb-4 pt-1 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-3 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              {/* Destination stop selector */}
              <div>
                <label
                  htmlFor="destination-stop-select"
                  className="text-[10px] font-label font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1"
                >
                  My Destination Stop:
                </label>
                <div className="relative">
                  <select
                    id="destination-stop-select"
                    value={destinationAlertStopId}
                    onChange={(e) => setDestinationAlertStopId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2 pl-3 pr-8 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none appearance-none cursor-pointer"
                  >
                    {stops.map((stop) => (
                      <option key={stop.id} value={stop.id}>
                        {stop.name} ({stop.area})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Alert Information Note */}
              <div className="p-2.5 rounded-xl bg-cyan-50/70 dark:bg-cyan-950/30 border border-cyan-200/50 dark:border-cyan-900/40 text-[11px] text-slate-600 dark:text-slate-300">
                <span>
                  🔔 When your bus approaches{' '}
                  <strong className="text-primary dark:text-cyan-300">
                    {destinationStopObject?.name?.split(' (')[0]}
                  </strong>
                  , SmartBus triggers an audible arrival chime and a visual arrival banner.
                </span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 6. ACTIVE FLEET: CLEAN HORIZONTAL RESPONSIVE GRID                         */}
      {/* ========================================================================= */}
      <section className="flex flex-col gap-3">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <h2 className="font-headline font-black text-lg sm:text-xl text-slate-900 dark:text-slate-100 tracking-tight">
              ACTIVE FLEET
            </h2>
            <span className="text-[11px] font-label font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-primary dark:text-cyan-400 border border-blue-200 dark:border-blue-900">
              {liveFleetCount} BUSES LIVE
            </span>
          </div>

          {/* Quick Filter Pill */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === 'ALL'
                  ? 'bg-primary text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter(statusFilter === 'ACTIVE' ? 'ALL' : 'ACTIVE')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === 'ACTIVE'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
              }`}
            >
              Active Only
            </button>
            <button
              onClick={() => setStatusFilter(statusFilter === 'DELAYED' ? 'ALL' : 'DELAYED')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === 'DELAYED'
                  ? 'bg-amber-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
              }`}
            >
              Delayed
            </button>
          </div>
        </div>

        {/* Responsive Grid: Desktop (4 cols) | Tablet (2 cols) | Mobile (1 col) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {filteredBuses.length === 0 ? (
            <div className="col-span-full p-8 text-center bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              <Bus className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No fleet vehicles match your filter criteria.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedRouteFilter('ALL');
                  setStatusFilter('ALL');
                }}
                className="mt-2 text-xs font-bold text-primary dark:text-cyan-400 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            filteredBuses.map((bus) => {
              const isSelected = selectedBus?.id === bus.id;
              const isFav = isFavoriteBus(bus.id);
              const bBadge = getStatusBadge(bus.status);
              const bCrowd = getCrowdBadgeInfo(
                bus.crowdLevel || getCrowdLevel(bus.occupancyPercent ?? 50)
              );
              const busRouteDisplay = bus.routeName?.replace(/\s+to\s+/i, ' → ') || 'Route';

              return (
                <div
                  key={bus.id}
                  onClick={() => setSelectedBusId(bus.id)}
                  className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-2.5 relative group ${
                    isSelected
                      ? 'bg-blue-50/50 dark:bg-slate-850 border-primary dark:border-cyan-400 shadow-md shadow-primary/10 ring-2 ring-primary/20 dark:ring-cyan-400/30'
                      : 'bg-white dark:bg-slate-900/90 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs hover:shadow-md'
                  }`}
                >
                  {/* Card Top: Bus Name & Plate + Status */}
                  <div>
                    <div className="flex items-center justify-between gap-1.5 mb-1">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-headline font-black text-sm text-slate-900 dark:text-slate-100">
                          {bus.number}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                          {bus.plate}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${bBadge.colorClass}`}>
                          {bBadge.label}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavoriteBus(bus.id);
                          }}
                          className="p-1 rounded-lg text-slate-300 hover:text-red-500 transition-colors"
                          title={isFav ? 'Remove favorite' : 'Save favorite'}
                          aria-label="Toggle favorite"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Route Line */}
                    <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                      {busRouteDisplay}
                    </p>
                  </div>

                  {/* Card Bottom: 3-Tile Telemetry (ETA, Seats, Crowd) */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[9px] font-label uppercase text-slate-400 block font-semibold">
                        ETA
                      </span>
                      <span className="font-headline font-black text-xs text-primary dark:text-cyan-400">
                        {bus.trafficAdjustedEtaMinutes > 0 ? `${bus.trafficAdjustedEtaMinutes} min` : 'Arrived'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[9px] font-label uppercase text-slate-400 block font-semibold">
                        Seats
                      </span>
                      <span className="font-bold text-xs text-slate-700 dark:text-slate-200">
                        {bus.availableSeats ?? 9} seats
                      </span>
                    </div>

                    <div>
                      <span className="text-[9px] font-label uppercase text-slate-400 block font-semibold">
                        Crowd
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${bCrowd.colorClass}`}>
                        {bCrowd.label}
                      </span>
                    </div>
                  </div>

                  {/* Selected Indicator Pill */}
                  {isSelected && (
                    <div className="absolute -top-2 right-4 px-2 py-0.5 rounded-full bg-primary text-white text-[9px] font-label font-bold uppercase tracking-wider shadow-xs">
                      Tracking
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}
