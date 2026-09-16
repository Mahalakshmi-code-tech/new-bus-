import React, { useState, useEffect } from 'react';
import { 
  Bus, 
  ArrowRight, 
  Navigation, 
  Clock, 
  MapPin, 
  Activity, 
  ShieldCheck, 
  Zap,
  Radio,
  Gauge,
  CheckCircle2,
  ChevronRight,
  Wifi,
  Compass
} from 'lucide-react';

function KineticTransitVisualComponent({ onTrackClick, onExploreClick }) {
  // 4 Waypoints representing Central to Airport via Saidapet & Guindy
  const waypoints = [
    { id: 'central', name: 'Central Station', x: 60, y: 50, eta: 'Origin', passed: true },
    { id: 'saidapet', name: 'Saidapet Corridor', x: 220, y: 75, eta: 'Departed', passed: true },
    { id: 'guindy', name: 'Guindy Junction', x: 380, y: 55, eta: 'Next • 8 min', current: true },
    { id: 'airport', name: 'Airport Express', x: 540, y: 80, eta: 'Terminal • 24 min', terminal: true }
  ];

  // Continuous smooth bus progress along polyline
  const [busProgress, setBusProgress] = useState(0.55);
  const [activeWaypoint, setActiveWaypoint] = useState('guindy');
  const [refreshCounter, setRefreshCounter] = useState(0.8);

  useEffect(() => {
    const motionTimer = setInterval(() => {
      setBusProgress(prev => {
        const next = prev + 0.005;
        return next > 0.9 ? 0.2 : next;
      });
    }, 100);

    const refreshTimer = setInterval(() => {
      setRefreshCounter(prev => (prev >= 2.0 ? 0.4 : +(prev + 0.2).toFixed(1)));
    }, 1500);

    return () => {
      clearInterval(motionTimer);
      clearInterval(refreshTimer);
    };
  }, []);

  // Compute interpolated X and Y along the route curve
  const currentBusX = 60 + busProgress * (540 - 60);
  const currentBusY = 65 + Math.sin(busProgress * Math.PI * 2) * 16;

  return (
    <section className="relative w-full rounded-3xl md:rounded-[2.5rem] bg-gradient-to-br from-[#0c1938] via-[#09152e] to-[#040c1e] text-white p-5 sm:p-8 md:p-10 border border-blue-500/20 shadow-2xl shadow-blue-950/40 overflow-hidden">
      {/* Background ambient neon glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Header Bar with Live Badge & GPS Status */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8 border-b border-white/10 pb-4 sm:pb-5">
        <div className="flex items-center gap-2.5">
          <div className="px-3.5 py-1.5 rounded-full bg-cyan-400 text-[#001849] font-label text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-400/25">
            <span className="w-2 h-2 rounded-full bg-[#001849] animate-pulse" />
            <span>LIVE NOW</span>
          </div>
          <span className="text-xs font-label uppercase tracking-widest text-cyan-300 font-bold hidden sm:inline">
            Smart City Telemetry Grid
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-body text-slate-300">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Wifi className="w-3.5 h-3.5" />
            GPS Stream Active
          </span>
          <span className="text-white/30">•</span>
          <span className="text-slate-400">Synced: {refreshCounter}s ago</span>
        </div>
      </div>

      {/* Main Grid: Visual Map & Live Gauges */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
        {/* Left Column (7 cols): Route Polyline & Moving Bus Marker */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="mb-4">
            <div className="flex items-center gap-2 text-xs font-label text-cyan-300 font-bold uppercase tracking-wider mb-1">
              <Navigation className="w-3.5 h-3.5 text-cyan-400" />
              <span>Corridor 21A • Active Transit Polyline</span>
            </div>
            <h3 className="font-headline font-extrabold text-xl sm:text-2xl md:text-3xl text-white">
              Central Station <span className="text-cyan-400">→</span> Airport Express
            </h3>
          </div>

          {/* Animated Route Line Canvas */}
          <div className="relative w-full h-48 sm:h-56 bg-white/[0.03] backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/10 p-2 sm:p-4 overflow-hidden flex items-center justify-center shadow-inner">
            <svg 
              viewBox="0 0 600 130" 
              className="w-full h-full overflow-visible"
              preserveAspectRatio="xMidYMid meet"
              aria-label="Route 21A Transit Line"
            >
              <defs>
                <linearGradient id="kineticRouteGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0050cb" />
                  <stop offset="50%" stopColor="#0066ff" />
                  <stop offset="100%" stopColor="#00ffff" />
                </linearGradient>

                <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="glow" />
                  <feComposite in="SourceGraphic" in2="glow" operator="over" />
                </filter>
              </defs>

              {/* Background Path Outline */}
              <path
                d="M 60 50 Q 220 100 380 55 T 540 80"
                fill="none"
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="6"
                strokeLinecap="round"
              />

              {/* Glowing Route Line */}
              <path
                d="M 60 50 Q 220 100 380 55 T 540 80"
                fill="none"
                stroke="url(#kineticRouteGrad)"
                strokeWidth="5"
                strokeLinecap="round"
                filter="url(#routeGlow)"
              />

              {/* Animated Dashed Flow Line */}
              <path
                d="M 60 50 Q 220 100 380 55 T 540 80"
                fill="none"
                stroke="#00ffff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="8 8"
                className="route-flow-dash"
              />

              {/* Waypoint Stations */}
              {waypoints.map((wp) => {
                const isActive = activeWaypoint === wp.id || wp.current;
                return (
                  <g key={wp.id} className="cursor-pointer" onClick={() => setActiveWaypoint(wp.id)}>
                    {wp.current && (
                      <circle cx={wp.x} cy={wp.y} r="15" fill="none" stroke="#00ffff" strokeWidth="1.5" opacity="0.6" className="animate-ping" />
                    )}

                    <circle
                      cx={wp.x}
                      cy={wp.y}
                      r={isActive ? "7" : "5"}
                      fill={isActive ? "#00ffff" : wp.passed ? "#0066ff" : "#1e293b"}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />

                    <text
                      x={wp.x}
                      y={wp.y + 20}
                      fill={isActive ? "#00ffff" : "#94a3b8"}
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                      fontFamily="sans-serif"
                    >
                      {wp.name.split(' ')[0]}
                    </text>
                  </g>
                );
              })}

              {/* Animated Moving Bus 21A Marker */}
              <g 
                transform={`translate(${currentBusX}, ${currentBusY})`}
                className="transition-all duration-100 ease-linear"
              >
                {/* Radar ripple rings */}
                <circle cx="0" cy="0" r="18" fill="none" stroke="#00ffff" strokeWidth="1.5" opacity="0.6" className="animate-ping" />
                <circle cx="0" cy="0" r="12" fill="#0050cb" stroke="#00ffff" strokeWidth="2.5" />
                <circle cx="0" cy="0" r="4" fill="#ffffff" />

                {/* Floating Bus 21A Badge */}
                <g transform="translate(0, -22)">
                  <rect x="-32" y="-12" width="64" height="17" rx="8" fill="#001849" stroke="#00ffff" strokeWidth="1" />
                  <text x="0" y="-1" fill="#00ffff" fontSize="8.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                    BUS 21A
                  </text>
                </g>
              </g>
            </svg>
          </div>

          {/* 3 Telemetry Gauges: Speed, Occupancy, Power */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 mt-3.5 sm:mt-4">
            <div className="bg-white/5 rounded-2xl p-2.5 sm:p-3.5 border border-white/10 text-center hover:bg-white/10 transition-colors">
              <span className="text-[10px] font-label text-slate-400 block uppercase font-bold tracking-wider">Speed</span>
              <span className="font-headline font-black text-sm sm:text-lg text-cyan-300">42 km/h</span>
            </div>
            <div className="bg-white/5 rounded-2xl p-2.5 sm:p-3.5 border border-white/10 text-center hover:bg-white/10 transition-colors">
              <span className="text-[10px] font-label text-slate-400 block uppercase font-bold tracking-wider">Occupancy</span>
              <span className="font-headline font-black text-sm sm:text-lg text-emerald-400">64% Seats</span>
            </div>
            <div className="bg-white/5 rounded-2xl p-2.5 sm:p-3.5 border border-white/10 text-center hover:bg-white/10 transition-colors">
              <span className="text-[10px] font-label text-slate-400 block uppercase font-bold tracking-wider">Power</span>
              <span className="font-headline font-black text-sm sm:text-lg text-cyan-300">100% EV Fleet</span>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Real-Time Vehicle Card */}
        <div className="lg:col-span-5">
          <div className="rounded-3xl p-6 sm:p-7 bg-white/[0.07] backdrop-blur-xl border border-white/20 shadow-2xl relative overflow-hidden group">
            {/* Top Accent Gradient Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0050cb] via-cyan-400 to-[#0050cb]" />

            {/* Live Indicator Header */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-label text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Live Telemetry
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-400/10 px-2.5 py-0.5 rounded-full border border-cyan-400/30">
                LINE-21A-EXPRESS
              </span>
            </div>

            {/* Bus Title & Route */}
            <div className="mb-5">
              <div className="flex items-baseline gap-2">
                <h4 className="font-headline font-black text-2xl sm:text-3xl text-white tracking-tight">
                  Bus 21A
                </h4>
                <span className="text-xs font-label uppercase px-2 py-0.5 rounded-md bg-primary/30 text-cyan-300 font-bold border border-cyan-400/20">
                  Airport Express
                </span>
              </div>
              <p className="text-sm font-body text-slate-300 flex items-center gap-1.5 mt-1">
                <span className="text-white font-semibold">Central Station</span>
                <span className="text-cyan-400">→</span>
                <span className="text-white font-semibold">Airport Express</span>
              </p>
            </div>

            {/* Telemetry Metrics Stack (Status, Next Stop, ETA) */}
            <div className="space-y-3 bg-black/35 rounded-2xl p-4 border border-white/10 mb-6">
              {/* Status */}
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-slate-400 font-medium">Status:</span>
                <span className="inline-flex items-center gap-1.5 font-bold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  On Time
                </span>
              </div>

              <div className="border-t border-white/10" />

              {/* Next Stop */}
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-slate-400 font-medium">Next Stop:</span>
                <span className="font-bold text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  Guindy
                </span>
              </div>

              <div className="border-t border-white/10" />

              {/* ETA */}
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-slate-400 font-medium">ETA:</span>
                <span className="font-headline font-black text-base sm:text-lg text-cyan-300 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  8 Minutes
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={onTrackClick}
                className="btn-primary flex-1 rounded-full py-3.5 px-5 font-bold text-xs sm:text-sm text-center shadow-lg shadow-blue-600/30 hover:shadow-cyan-400/40 flex items-center justify-center gap-2 group/btn"
                aria-label="Track Bus 21A live"
              >
                <span>Track Bus 21A</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={onExploreClick}
                className="btn-ghost flex-1 rounded-full py-3.5 px-5 font-bold text-xs sm:text-sm text-center border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10 flex items-center justify-center gap-1.5"
                aria-label="Explore Corridor Routes"
              >
                <span>Explore Route</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export const KineticTransitVisual = React.memo(KineticTransitVisualComponent);
export default KineticTransitVisual;
