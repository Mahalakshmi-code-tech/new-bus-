import React from 'react';
import { Bus, Route as RouteIcon, MapPin, Clock, Activity, Zap } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

export default function SmartStatusSection({ className = '', onActionClick }) {
  const cards = [
    {
      id: 'active-buses',
      title: 'Active Buses',
      emoji: '🚌',
      icon: Bus,
      value: 118,
      suffix: '',
      unit: 'vehicles',
      subtext: '100% GPS Synchronized',
      accentColor: '#0050cb',
      glowColor: 'rgba(0, 80, 203, 0.15)',
      badge: 'LIVE FLEET',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
    },
    {
      id: 'available-routes',
      title: 'Available Routes',
      emoji: '🛣️',
      icon: RouteIcon,
      value: 85,
      suffix: '+',
      unit: 'corridors',
      subtext: 'AI Traffic Optimized',
      accentColor: '#0066ff',
      glowColor: 'rgba(0, 102, 255, 0.15)',
      badge: 'ACTIVE GRID',
      badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-cyan-400 border-blue-500/20'
    },
    {
      id: 'live-stops',
      title: 'Live Stops',
      emoji: '📍',
      icon: MapPin,
      value: 342,
      suffix: '',
      unit: 'stations',
      subtext: 'Sub-second Radar Mesh',
      accentColor: '#00ffff',
      glowColor: 'rgba(0, 255, 255, 0.12)',
      badge: 'METRO NODES',
      badgeColor: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20'
    },
    {
      id: 'average-eta',
      title: 'Average ETA',
      emoji: '⏱️',
      icon: Clock,
      value: 6.4,
      decimals: 1,
      suffix: ' min',
      unit: 'headway',
      subtext: 'Nominal Fleet Velocity',
      accentColor: '#0050cb',
      glowColor: 'rgba(0, 80, 203, 0.15)',
      badge: 'HIGH EFFICIENCY',
      badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
    }
  ];

  return (
    <section className={`w-full max-w-container-max mx-auto px-4 sm:px-6 md:px-margin-desktop py-8 sm:py-12 ${className}`}>
      {/* Small Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 mb-6 sm:mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-cyan-400 text-[11px] sm:text-xs font-label font-bold uppercase tracking-wider mb-2 border border-primary/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ffff]"></span>
            </span>
            <span>Live Smart Mobility Status</span>
          </div>
          <h2 className="font-headline font-extrabold text-xl sm:text-2xl md:text-3xl text-on-surface dark:text-slate-100 tracking-tight">
            Metropolitan Transit Velocity
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs font-label text-on-surface-variant dark:text-slate-400">
          <Activity className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
          <span>Real-time Telemetry Synced</span>
        </div>
      </div>

      {/* 4 Cards Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="group relative rounded-3xl p-5 sm:p-6 bg-white/80 dark:bg-[#111c33]/80 backdrop-blur-xl border border-white/80 dark:border-slate-750/70 shadow-glass dark:shadow-black/40 hover:shadow-glass-lg dark:hover:shadow-cyan-500/10 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col justify-between"
              style={{
                borderRadius: '28px'
              }}
            >
              {/* Subtle ambient light corner glow */}
              <div 
                className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity"
                style={{ backgroundColor: card.glowColor }}
              />

              <div>
                {/* Top Row: Icon + Badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-[#0050cb]/10 dark:bg-primary/25 text-[#0050cb] dark:text-cyan-400 flex items-center justify-center text-xl shadow-xs border border-[#0050cb]/15 dark:border-cyan-400/20 group-hover:scale-105 group-hover:bg-[#0050cb] group-hover:text-white transition-all duration-300">
                    <span className="select-none text-base" role="img" aria-label={card.title}>
                      {card.emoji}
                    </span>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-label font-bold uppercase tracking-wider border ${card.badgeColor}`}>
                    {card.badge}
                  </span>
                </div>

                {/* Card Title */}
                <h3 className="text-on-surface-variant dark:text-slate-400 text-xs font-label uppercase tracking-wider font-semibold mb-1">
                  {card.title}
                </h3>

                {/* Animated Number Counter */}
                <div className="flex items-baseline gap-1.5 mb-1.5">
                  <AnimatedCounter 
                    value={card.value}
                    decimals={card.decimals || 0}
                    suffix={card.suffix}
                    duration={1600}
                    className="font-black text-3xl sm:text-4xl text-[#0050cb] dark:text-cyan-400 tracking-tight"
                  />
                  <span className="text-xs font-body font-medium text-on-surface-variant/70 dark:text-slate-400">
                    {card.unit}
                  </span>
                </div>
              </div>

              {/* Subtext and Bottom Decorative Bar */}
              <div className="pt-3 mt-2 border-t border-outline-variant/30 dark:border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-on-surface-variant dark:text-slate-400 truncate">
                  {card.subtext}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0 ml-1"></span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
