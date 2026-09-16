import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Bus,
  Route as RouteIcon,
  Users,
  Clock,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Zap,
  Leaf,
  Activity,
  Calendar,
  Filter,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info,
  CheckCircle2,
  Navigation,
  RefreshCw
} from 'lucide-react';
import { useTransit } from '../context/TransitContext';
import AnimatedCounter from '../components/AnimatedCounter';
import {
  calculateFleetKpis,
  calculateOccupancyTrends,
  calculateRoutePerformance,
  calculateFleetStatusBreakdown,
  calculateEvFleetMetrics,
  formatRecentAlerts
} from '../services/analyticsService';

export default function Analytics({ setCurrentPage }) {
  const {
    buses,
    routes,
    stops,
    notifications,
    setSelectedBusId
  } = useTransit();

  // Filters State
  const [timeRange, setTimeRange] = useState('today'); // 'today' | '7d' | '30d'
  const [selectedRouteFilter, setSelectedRouteFilter] = useState('all');
  const [selectedBusFilter, setSelectedBusFilter] = useState('all');
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // 1. Calculate Primary KPIs
  const kpis = useMemo(() => {
    return calculateFleetKpis(buses, routes);
  }, [buses, routes]);

  // 2. Calculate Occupancy Trend Data Points
  const occupancyTrend = useMemo(() => {
    return calculateOccupancyTrends(buses, timeRange, selectedRouteFilter);
  }, [buses, timeRange, selectedRouteFilter]);

  // 3. Calculate Route Performance Metrics
  const routePerformance = useMemo(() => {
    return calculateRoutePerformance(routes, buses);
  }, [routes, buses]);

  // 4. Calculate Fleet Status Distribution
  const fleetStatus = useMemo(() => {
    return calculateFleetStatusBreakdown(buses);
  }, [buses]);

  // 5. Calculate EV Fleet & Propulsion Metrics
  const evMetrics = useMemo(() => {
    return calculateEvFleetMetrics(buses);
  }, [buses]);

  // 6. Recent Alerts Feed
  const recentAlerts = useMemo(() => {
    return formatRecentAlerts(notifications, 5);
  }, [notifications]);

  // SVG Chart Geometry Calculations
  const chartWidth = 700;
  const chartHeight = 200;
  const paddingX = 20;
  const paddingY = 20;
  const innerWidth = chartWidth - paddingX * 2;
  const innerHeight = chartHeight - paddingY * 2;

  const points = useMemo(() => {
    if (!occupancyTrend.length) return [];
    return occupancyTrend.map((pt, idx) => {
      const x = paddingX + (idx / (occupancyTrend.length - 1)) * innerWidth;
      // occupancy range 0..100 maps to innerHeight..0
      const y = paddingY + innerHeight - (pt.occupancy / 100) * innerHeight;
      return { ...pt, x, y };
    });
  }, [occupancyTrend, innerWidth, innerHeight]);

  // SVG Path generator
  const areaPath = useMemo(() => {
    if (!points.length) return '';
    const lineCoords = points.map(p => `${p.x} ${p.y}`).join(' L ');
    const firstX = points[0].x;
    const lastX = points[points.length - 1].x;
    const baselineY = paddingY + innerHeight;
    return `M ${firstX} ${baselineY} L ${lineCoords} L ${lastX} ${baselineY} Z`;
  }, [points, paddingY, innerHeight]);

  const linePath = useMemo(() => {
    if (!points.length) return '';
    return `M ` + points.map(p => `${p.x} ${p.y}`).join(' L ');
  }, [points]);

  // Navigation Helper
  const handleNavigateToBus = (busId) => {
    if (busId && setSelectedBusId) {
      setSelectedBusId(busId);
    }
    if (setCurrentPage) {
      setCurrentPage('tracking');
    }
  };

  const handleNavigateToRoutes = () => {
    if (setCurrentPage) {
      setCurrentPage('routes');
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-[#0b1120] text-on-surface dark:text-slate-100 transition-colors duration-300 pt-20 sm:pt-24 pb-16 px-4 sm:px-6 md:px-margin-desktop max-w-container-max mx-auto">
      
      {/* 1. PAGE HEADER */}
      <header className="mb-6 sm:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant/20 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-9 h-9 rounded-2xl bg-primary/10 dark:bg-primary/25 text-primary dark:text-cyan-400 flex items-center justify-center border border-primary/20 dark:border-cyan-500/30">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h1 className="font-headline font-extrabold text-2xl sm:text-3xl md:text-4xl text-on-surface dark:text-slate-100 tracking-tight">
              Transit Analytics
            </h1>
            
            {/* Visual Simulation Data Indicator */}
            <span 
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-label font-bold bg-primary/10 dark:bg-cyan-950/60 text-primary dark:text-cyan-400 border border-primary/20 dark:border-cyan-500/40 shadow-xs"
              title="This dashboard visualizes live simulated fleet and timetable data"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>SIMULATION DATA</span>
            </span>
          </div>

          <p className="text-xs sm:text-sm text-on-surface-variant dark:text-slate-400">
            Monitor fleet performance, route activity and passenger trends.
          </p>
        </div>

        {/* Quick Context Action */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => handleNavigateToRoutes()}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-surface-container-low dark:bg-slate-800 hover:bg-surface-container dark:hover:bg-slate-750 text-primary dark:text-cyan-400 border border-outline-variant/30 dark:border-slate-700 transition-all flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <RouteIcon className="w-3.5 h-3.5" />
            <span>Corridors</span>
          </button>
          <button
            onClick={() => handleNavigateToBus('bus-21a')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold btn-primary flex items-center gap-1.5 shadow-sm"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Live Radar</span>
          </button>
        </div>
      </header>

      {/* 2. COMPACT ANALYTICS FILTER BAR */}
      <section 
        aria-label="Analytics Filters"
        className="mb-6 sm:mb-8 p-3 sm:p-4 rounded-2xl bg-surface-container-low/80 dark:bg-slate-850/80 border border-outline-variant/25 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 backdrop-blur-md shadow-xs"
      >
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-1 min-w-[260px]">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant dark:text-slate-400">
            <Filter className="w-3.5 h-3.5 text-primary dark:text-cyan-400" />
            <span>Filters:</span>
          </div>

          {/* Route Filter Dropdown */}
          <select
            aria-label="Filter by Route"
            value={selectedRouteFilter}
            onChange={(e) => setSelectedRouteFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-on-surface dark:text-slate-200 border border-outline-variant/30 dark:border-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-xs"
          >
            <option value="all">All Routes (Corridors)</option>
            {routes.map(r => (
              <option key={r.id} value={r.id}>
                Route {r.number}: {r.name.split(' to ')[0] || r.name}
              </option>
            ))}
          </select>

          {/* Bus Filter Dropdown */}
          <select
            aria-label="Filter by Bus"
            value={selectedBusFilter}
            onChange={(e) => setSelectedBusFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-on-surface dark:text-slate-200 border border-outline-variant/30 dark:border-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-xs"
          >
            <option value="all">All Fleet Buses</option>
            {buses.map(b => (
              <option key={b.id} value={b.id}>
                {b.number} — {b.routeName}
              </option>
            ))}
          </select>
        </div>

        {/* Time Horizon Filter Pills */}
        <div className="flex items-center gap-1 bg-surface-container dark:bg-slate-800 p-1 rounded-xl border border-outline-variant/20 dark:border-slate-750">
          {[
            { id: 'today', label: 'Today' },
            { id: '7d', label: '7 Days' },
            { id: '30d', label: '30 Days' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTimeRange(t.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all focus:outline-none ${
                timeRange === t.id
                  ? 'bg-primary text-white dark:bg-cyan-500 dark:text-slate-950 font-bold shadow-xs'
                  : 'text-on-surface-variant dark:text-slate-400 hover:text-on-surface dark:hover:text-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </section>

      {/* 3. PRIMARY KPI CARDS */}
      <section aria-label="Key Performance Indicators" className="mb-6 sm:mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          
          {/* KPI 1: Active Fleet */}
          <div className="glass-card dark:bg-slate-850/90 rounded-3xl p-4 sm:p-5 border border-outline-variant/30 dark:border-slate-750 shadow-md shadow-primary/5 dark:shadow-black/30 hover:border-primary/40 dark:hover:border-cyan-400/40 transition-all card-hover group">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 dark:bg-primary/25 text-primary dark:text-cyan-400 flex items-center justify-center border border-primary/20 dark:border-cyan-500/30 group-hover:scale-105 transition-transform">
                <Bus className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40">
                {kpis.activeFleet.status}
              </span>
            </div>
            <p className="text-xs font-semibold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">
              {kpis.activeFleet.label}
            </p>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-on-surface dark:text-slate-100 font-headline">
                <AnimatedCounter value={kpis.activeFleet.value} />
              </span>
              <span className="text-xs text-on-surface-variant dark:text-slate-400 font-medium">
                / {kpis.activeFleet.total} total
              </span>
            </div>
            <p className="text-[11px] text-on-surface-variant dark:text-slate-400 mt-2 flex items-center gap-1 border-t border-outline-variant/15 dark:border-slate-800 pt-2">
              <Activity className="w-3 h-3 text-primary dark:text-cyan-400" />
              <span>{kpis.activeFleet.context}</span>
            </p>
          </div>

          {/* KPI 2: Active Routes */}
          <div className="glass-card dark:bg-slate-850/90 rounded-3xl p-4 sm:p-5 border border-outline-variant/30 dark:border-slate-750 shadow-md shadow-primary/5 dark:shadow-black/30 hover:border-primary/40 dark:hover:border-cyan-400/40 transition-all card-hover group">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200 dark:border-indigo-800/40 group-hover:scale-105 transition-transform">
                <RouteIcon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-300/40">
                {kpis.activeRoutes.status}
              </span>
            </div>
            <p className="text-xs font-semibold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">
              {kpis.activeRoutes.label}
            </p>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-on-surface dark:text-slate-100 font-headline">
                <AnimatedCounter value={kpis.activeRoutes.value} />
              </span>
              <span className="text-xs text-on-surface-variant dark:text-slate-400 font-medium">
                Corridors
              </span>
            </div>
            <p className="text-[11px] text-on-surface-variant dark:text-slate-400 mt-2 flex items-center gap-1 border-t border-outline-variant/15 dark:border-slate-800 pt-2">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span>{kpis.activeRoutes.context}</span>
            </p>
          </div>

          {/* KPI 3: Average Occupancy */}
          <div className="glass-card dark:bg-slate-850/90 rounded-3xl p-4 sm:p-5 border border-outline-variant/30 dark:border-slate-750 shadow-md shadow-primary/5 dark:shadow-black/30 hover:border-primary/40 dark:hover:border-cyan-400/40 transition-all card-hover group">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center border border-cyan-200 dark:border-cyan-800/40 group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-300/40">
                {kpis.avgOccupancy.status}
              </span>
            </div>
            <p className="text-xs font-semibold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">
              {kpis.avgOccupancy.label}
            </p>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-primary dark:text-cyan-400 font-headline">
                <AnimatedCounter value={kpis.avgOccupancy.value} suffix="%" />
              </span>
              <span className="text-xs text-on-surface-variant dark:text-slate-400 font-medium">
                Capacity
              </span>
            </div>
            <p className="text-[11px] text-on-surface-variant dark:text-slate-400 mt-2 flex items-center gap-1 border-t border-outline-variant/15 dark:border-slate-800 pt-2">
              <TrendingUp className="w-3 h-3 text-cyan-500" />
              <span>{kpis.avgOccupancy.context}</span>
            </p>
          </div>

          {/* KPI 4: On-Time Performance */}
          <div className="glass-card dark:bg-slate-850/90 rounded-3xl p-4 sm:p-5 border border-outline-variant/30 dark:border-slate-750 shadow-md shadow-primary/5 dark:shadow-black/30 hover:border-primary/40 dark:hover:border-cyan-400/40 transition-all card-hover group">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800/40 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40">
                {kpis.onTimePerformance.status}
              </span>
            </div>
            <p className="text-xs font-semibold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">
              {kpis.onTimePerformance.label}
            </p>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-headline">
                {kpis.onTimePerformance.value}%
              </span>
              <span className="text-xs text-on-surface-variant dark:text-slate-400 font-medium">
                Punctuality
              </span>
            </div>
            <p className="text-[11px] text-on-surface-variant dark:text-slate-400 mt-2 flex items-center gap-1 border-t border-outline-variant/15 dark:border-slate-800 pt-2">
              <Clock className="w-3 h-3 text-emerald-500" />
              <span>{kpis.onTimePerformance.context}</span>
            </p>
          </div>

        </div>
      </section>

      {/* 4. FLEET OCCUPANCY TREND (LINE / AREA CHART) */}
      <section aria-label="Fleet Occupancy Trend" className="mb-6 sm:mb-8">
        <div className="glass-card dark:bg-slate-850/90 rounded-3xl p-5 sm:p-6 md:p-7 border border-outline-variant/30 dark:border-slate-750 shadow-xl shadow-primary/5 dark:shadow-black/40">
          
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-primary/10 dark:bg-primary/25 text-primary dark:text-cyan-400">
                  <TrendingUp className="w-4 h-4" />
                </span>
                <h2 className="font-headline font-bold text-lg sm:text-xl text-on-surface dark:text-slate-100">
                  Fleet Occupancy Trend
                </h2>
              </div>
              <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-1">
                Seat utilization and passenger density profile across simulated transit hours.
              </p>
            </div>

            {/* Current Peak Highlight */}
            <div className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 dark:bg-cyan-950/60 text-primary dark:text-cyan-400 border border-primary/20 dark:border-cyan-500/30 self-start sm:self-auto">
              Current Horizon: <span className="font-bold capitalize">{timeRange}</span>
            </div>
          </div>

          {/* SVG Area Chart Container */}
          <div className="relative w-full overflow-hidden select-none">
            
            {/* Tooltip Overlay */}
            {hoveredPoint && (
              <div 
                className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-2 px-3 py-1.5 rounded-xl bg-slate-900/95 dark:bg-slate-800/95 text-white text-xs shadow-xl border border-white/10 backdrop-blur-md transition-all duration-150"
                style={{ left: `${(hoveredPoint.x / chartWidth) * 100}%`, top: `${(hoveredPoint.y / chartHeight) * 100}%` }}
              >
                <p className="font-bold text-cyan-400">{hoveredPoint.time} • {hoveredPoint.occupancy}% Occupancy</p>
                <p className="text-[10px] text-slate-300">{hoveredPoint.label}</p>
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 rotate-45 bg-slate-900/95 dark:bg-slate-800/95 border-b border-r border-white/10" />
              </div>
            )}

            <div className="h-52 sm:h-64 w-full">
              <svg 
                className="w-full h-full overflow-visible"
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="occupancyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0066ff" stopOpacity="0.45" />
                    <stop offset="60%" stopColor="#0066ff" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#0066ff" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Guide Grid Lines */}
                <line x1={paddingX} y1={paddingY} x2={chartWidth - paddingX} y2={paddingY} className="stroke-outline-variant/30 dark:stroke-slate-750" strokeDasharray="4 4" />
                <line x1={paddingX} y1={paddingY + innerHeight * 0.25} x2={chartWidth - paddingX} y2={paddingY + innerHeight * 0.25} className="stroke-outline-variant/30 dark:stroke-slate-750" strokeDasharray="4 4" />
                <line x1={paddingX} y1={paddingY + innerHeight * 0.5} x2={chartWidth - paddingX} y2={paddingY + innerHeight * 0.5} className="stroke-outline-variant/30 dark:stroke-slate-750" strokeDasharray="4 4" />
                <line x1={paddingX} y1={paddingY + innerHeight * 0.75} x2={chartWidth - paddingX} y2={paddingY + innerHeight * 0.75} className="stroke-outline-variant/30 dark:stroke-slate-750" strokeDasharray="4 4" />
                <line x1={paddingX} y1={paddingY + innerHeight} x2={chartWidth - paddingX} y2={paddingY + innerHeight} className="stroke-outline-variant/40 dark:stroke-slate-700" strokeWidth="1" />

                {/* Area Gradient Under Curve */}
                {areaPath && (
                  <path d={areaPath} fill="url(#occupancyGradient)" />
                )}

                {/* Line Path */}
                {linePath && (
                  <path 
                    d={linePath} 
                    fill="none" 
                    stroke="currentColor" 
                    className="text-primary dark:text-cyan-400 transition-all duration-300"
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                )}

                {/* Data Points Interactive Targets */}
                {points.map((pt, idx) => (
                  <g 
                    key={idx} 
                    className="cursor-pointer group"
                    onMouseEnter={() => setHoveredPoint(pt)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    <circle 
                      cx={pt.x} 
                      cy={pt.y} 
                      r={pt.isPeak ? "6" : "4.5"} 
                      className="fill-white dark:fill-slate-900 stroke-primary dark:stroke-cyan-400 group-hover:r-7 transition-all duration-150"
                      strokeWidth="2.5"
                    />
                    {pt.isPeak && (
                      <circle cx={pt.x} cy={pt.y} r="2.5" className="fill-amber-500" />
                    )}
                  </g>
                ))}
              </svg>
            </div>

            {/* X-Axis Labels */}
            <div className="flex justify-between items-center text-[10px] sm:text-xs text-on-surface-variant dark:text-slate-400 font-label mt-3 px-2">
              {occupancyTrend.map((pt, i) => (
                <span key={i} className="font-semibold">{pt.time}</span>
              ))}
            </div>
          </div>

          {/* Chart Summary Legend */}
          <div className="mt-5 pt-3 border-t border-outline-variant/20 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-on-surface-variant dark:text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-primary dark:bg-cyan-400 inline-block" />
                <span>Live Load Trend</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                <span>Peak Load Period</span>
              </span>
            </div>
            <span>Calculated from active vehicle telemetry updates</span>
          </div>

        </div>
      </section>

      {/* 5. ROUTE PERFORMANCE (HYBRID CARD/TABLE) */}
      <section aria-label="Route Performance" className="mb-6 sm:mb-8">
        <div className="glass-card dark:bg-slate-850/90 rounded-3xl p-5 sm:p-6 md:p-7 border border-outline-variant/30 dark:border-slate-750 shadow-xl shadow-primary/5 dark:shadow-black/40">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <RouteIcon className="w-4 h-4" />
                </span>
                <h2 className="font-headline font-bold text-lg sm:text-xl text-on-surface dark:text-slate-100">
                  Route Performance Matrix
                </h2>
              </div>
              <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-1">
                Corridor health, bus allocations, passenger load, and scheduled transit delays.
              </p>
            </div>
          </div>

          {/* Responsive Table / Cards Container */}
          <div className="overflow-x-auto hide-scrollbar -mx-2 sm:mx-0">
            <table className="w-full text-left text-xs border-collapse min-w-[620px]">
              <thead>
                <tr className="border-b border-outline-variant/30 dark:border-slate-800 text-on-surface-variant dark:text-slate-400 uppercase text-[10px] font-label font-bold">
                  <th className="py-3 px-3">Corridor</th>
                  <th className="py-3 px-3 text-center">Active Buses</th>
                  <th className="py-3 px-3">Avg Occupancy</th>
                  <th className="py-3 px-3 text-center">Travel ETA</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/15 dark:divide-slate-800">
                {routePerformance.map((route) => (
                  <tr 
                    key={route.id}
                    className="hover:bg-surface-container-low/80 dark:hover:bg-slate-800/60 transition-colors group"
                  >
                    {/* Corridor Details */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-xl bg-primary/10 dark:bg-primary/25 text-primary dark:text-cyan-400 font-bold flex items-center justify-center shrink-0 text-xs">
                          {route.number}
                        </span>
                        <div>
                          <p className="font-bold text-on-surface dark:text-slate-100 text-xs sm:text-sm">
                            {route.name}
                          </p>
                          <p className="text-[11px] text-on-surface-variant dark:text-slate-400">
                            {route.from} ➔ {route.to} • {route.distanceKm} km
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Active Buses */}
                    <td className="py-3.5 px-3 text-center font-mono font-bold text-on-surface dark:text-slate-200">
                      {route.activeBusesCount} units
                    </td>

                    {/* Occupancy Bar */}
                    <td className="py-3.5 px-3 w-40">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold font-mono">
                          <span>{route.avgOccupancy}%</span>
                          <span className="text-on-surface-variant dark:text-slate-400">
                            {route.avgOccupancy >= 80 ? 'Heavy' : route.avgOccupancy >= 50 ? 'Moderate' : 'Light'}
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-surface-container-high dark:bg-slate-750 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              route.avgOccupancy >= 80 
                                ? 'bg-red-500' 
                                : route.avgOccupancy >= 50 
                                  ? 'bg-primary dark:bg-cyan-400' 
                                  : 'bg-emerald-500'
                            }`}
                            style={{ width: `${route.avgOccupancy}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Travel ETA */}
                    <td className="py-3.5 px-3 text-center">
                      <span className="font-bold text-on-surface dark:text-slate-200">
                        {route.etaMinutes} min
                      </span>
                      {route.delayMinutes > 0 && (
                        <span className="block text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                          +{route.delayMinutes}m delay
                        </span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${route.statusColor}`}>
                        {route.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => handleNavigateToRoutes()}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold text-primary dark:text-cyan-400 hover:bg-primary/10 dark:hover:bg-primary/25 transition-colors inline-flex items-center gap-1 focus:outline-none"
                        title="View route corridor details"
                      >
                        <span>View</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 6 & 7: FLEET STATUS & EV FLEET ANALYTICS (2-COLUMN GRID) */}
      <section aria-label="Fleet Breakdown and Clean Mobility" className="mb-6 sm:mb-8 grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        
        {/* 6. Fleet Status */}
        <div className="glass-card dark:bg-slate-850/90 rounded-3xl p-5 sm:p-6 border border-outline-variant/30 dark:border-slate-750 shadow-xl shadow-primary/5 dark:shadow-black/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-primary/10 dark:bg-primary/25 text-primary dark:text-cyan-400">
                  <Bus className="w-4 h-4" />
                </span>
                <h3 className="font-headline font-bold text-base sm:text-lg text-on-surface dark:text-slate-100">
                  Fleet Status Distribution
                </h3>
              </div>
              <span className="text-xs font-bold text-primary dark:text-cyan-400 font-mono">
                {fleetStatus.total} Units Registered
              </span>
            </div>

            <p className="text-xs text-on-surface-variant dark:text-slate-400 mb-4">
              Real-time operational distribution across active corridors and depot maintenance bays.
            </p>

            {/* Combined Segmented Status Bar */}
            <div className="w-full h-3 rounded-full bg-surface-container dark:bg-slate-750 overflow-hidden flex mb-4">
              {fleetStatus.categories.map((cat, i) => (
                <div 
                  key={i}
                  className={`h-full ${cat.color} transition-all duration-300`}
                  style={{ width: `${cat.percent}%` }}
                  title={`${cat.label}: ${cat.count} buses (${cat.percent}%)`}
                />
              ))}
            </div>

            {/* Metric Status Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {fleetStatus.categories.map((cat, i) => (
                <div 
                  key={i}
                  className="p-3 rounded-2xl bg-surface-container-low/80 dark:bg-slate-800/80 border border-outline-variant/20 dark:border-slate-700/60"
                >
                  <span className="text-[10px] text-on-surface-variant dark:text-slate-400 block font-semibold">
                    {cat.label}
                  </span>
                  <p className="text-lg sm:text-xl font-black text-on-surface dark:text-slate-100 font-headline mt-0.5">
                    {cat.count}
                  </p>
                  <span className="text-[10px] text-outline dark:text-slate-400 font-mono">
                    {cat.percent}% of fleet
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-outline-variant/15 dark:border-slate-800 text-[11px] text-on-surface-variant dark:text-slate-400 flex justify-between items-center">
            <span>Standby Backup Capacity: <strong>1 Spare Unit</strong></span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">100% Corridor Coverage</span>
          </div>
        </div>

        {/* 7. EV Fleet Analytics */}
        <div className="glass-card dark:bg-slate-850/90 rounded-3xl p-5 sm:p-6 border border-outline-variant/30 dark:border-slate-750 shadow-xl shadow-primary/5 dark:shadow-black/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300">
                  <Zap className="w-4 h-4" />
                </span>
                <h3 className="font-headline font-bold text-base sm:text-lg text-on-surface dark:text-slate-100">
                  EV Fleet & Clean Mobility
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border border-cyan-300/40">
                {evMetrics.cleanTransitRatio}% Clean Energy
              </span>
            </div>

            <p className="text-xs text-on-surface-variant dark:text-slate-400 mb-4">
              Telemetry derived from simulated vehicle powertrain and zero-emission deployments.
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-cyan-50/60 dark:bg-cyan-950/30 border border-cyan-200/50 dark:border-cyan-800/40">
                <span className="text-[10px] uppercase font-bold text-cyan-800 dark:text-cyan-300 block">
                  Active EV Buses
                </span>
                <span className="text-xl sm:text-2xl font-black text-cyan-900 dark:text-cyan-200 font-headline">
                  {evMetrics.activeEvCount} Buses
                </span>
                <span className="text-[10px] text-cyan-700 dark:text-cyan-400 block mt-0.5">
                  In-Service Operating Units
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/40">
                <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300 block">
                  Power Status
                </span>
                <span className="text-sm sm:text-base font-bold text-emerald-900 dark:text-emerald-200 block mt-1">
                  Synchronized
                </span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block mt-0.5">
                  Depot Fast Charging Ready
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-800/40">
                <span className="text-[10px] uppercase font-bold text-blue-800 dark:text-blue-300 block">
                  Average Clean Power
                </span>
                <span className="text-xl sm:text-2xl font-black text-primary dark:text-cyan-400 font-headline">
                  {evMetrics.cleanTransitRatio}%
                </span>
                <span className="text-[10px] text-blue-700 dark:text-slate-400 block mt-0.5">
                  Zero / Low Emission Ratio
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-surface-container-low dark:bg-slate-800 border border-outline-variant/30 dark:border-slate-700">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant dark:text-slate-400 block">
                  Total EV Fleet
                </span>
                <span className="text-xl sm:text-2xl font-black text-on-surface dark:text-slate-200 font-headline">
                  {evMetrics.totalEvCount} Units
                </span>
                <span className="text-[10px] text-on-surface-variant dark:text-slate-400 block mt-0.5">
                  Registered Fleet Roster
                </span>
              </div>
            </div>

            {/* Propulsion Breakdown */}
            <div className="space-y-2.5">
              {evMetrics.propulsionBreakdown.map((item, i) => (
                <div key={i} className="text-xs space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-semibold text-on-surface dark:text-slate-200">
                      {item.type}
                    </span>
                    <span className="font-mono font-bold text-on-surface dark:text-slate-200">
                      {item.count} units ({item.percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-surface-container dark:bg-slate-750 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full ${item.color.split(' ')[0]}`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-outline-variant/15 dark:border-slate-800 text-[11px] text-on-surface-variant dark:text-slate-400 flex justify-between items-center">
            <span className="flex items-center gap-1">
              <Leaf className="w-3.5 h-3.5 text-emerald-500" />
              <span>Simulated CO₂ Offset: ~1.8 tons saved</span>
            </span>
            <span className="text-primary dark:text-cyan-400 font-bold">Eco Tier A</span>
          </div>
        </div>

      </section>

      {/* 8. RECENT TRANSIT ALERTS SUMMARY */}
      <section aria-label="Recent Transit Alerts" className="mb-6 sm:mb-8">
        <div className="glass-card dark:bg-slate-850/90 rounded-3xl p-5 sm:p-6 border border-outline-variant/30 dark:border-slate-750 shadow-xl shadow-primary/5 dark:shadow-black/40">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
                <AlertTriangle className="w-4 h-4" />
              </span>
              <h2 className="font-headline font-bold text-base sm:text-lg text-on-surface dark:text-slate-100">
                Recent Transit Alerts
              </h2>
            </div>
            <span className="text-xs text-on-surface-variant dark:text-slate-400">
              Live alert stream from notification system
            </span>
          </div>

          {recentAlerts.length === 0 ? (
            <div className="py-8 text-center text-xs text-on-surface-variant dark:text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-500/60 mx-auto mb-2" />
              <p>No active transit alerts currently recorded.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentAlerts.map(alert => {
                const getAlertIcon = () => {
                  if (alert.iconKey === 'approaching') return <Navigation className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
                  if (alert.iconKey === 'delay') return <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
                  if (alert.iconKey === 'crowd') return <Users className="w-4 h-4 text-red-600 dark:text-red-400" />;
                  if (alert.iconKey === 'route') return <RouteIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
                  return <Activity className="w-4 h-4 text-primary dark:text-cyan-400" />;
                };

                return (
                  <div
                    key={alert.id}
                    onClick={() => alert.busId && handleNavigateToBus(alert.busId)}
                    className="p-3 sm:p-3.5 rounded-2xl bg-surface-container-low/70 dark:bg-slate-800/70 border border-outline-variant/20 dark:border-slate-700/60 flex items-center justify-between gap-3 hover:border-primary/40 dark:hover:border-cyan-400/40 transition-all cursor-pointer group select-none"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Icon */}
                      <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-750 flex items-center justify-center shrink-0 border border-outline-variant/30 dark:border-slate-700">
                        {getAlertIcon()}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          {/* Alert Type */}
                          <span className="text-[10px] font-bold text-on-surface-variant dark:text-slate-300">
                            {alert.alertType}
                          </span>
                          {/* Bus / Route Tag */}
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-surface-container-high dark:bg-slate-700 text-on-surface dark:text-slate-200">
                            {alert.busOrRoute}
                          </span>
                          {/* Status Badge */}
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase tracking-wider ${alert.statusBadge.color}`}>
                            {alert.statusBadge.label}
                          </span>
                        </div>

                        <p className="font-bold text-xs text-on-surface dark:text-slate-100 truncate group-hover:text-primary dark:group-hover:text-cyan-400 transition-colors">
                          {alert.title}
                        </p>
                        <p className="text-[11px] text-on-surface-variant dark:text-slate-400 truncate">
                          {alert.message}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-outline dark:text-slate-400 font-mono">
                        {alert.timestamp}
                      </span>
                      <ChevronRight className="w-4 h-4 text-outline dark:text-slate-400 group-hover:text-primary dark:group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
