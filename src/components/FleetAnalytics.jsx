import React, { useState } from 'react';
import { 
  TrendingDown, 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  Clock, 
  Activity, 
  CheckCircle2, 
  Gauge,
  Zap,
  Info
} from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

export default function FleetAnalytics() {
  const [selectedDelayTimeframe, setSelectedDelayTimeframe] = useState('today');

  // Delay trend data across peak/off-peak windows
  const delayTrendData = [
    { window: '06:00', delayMin: 1.2, status: 'nominal', onTimeRate: 99 },
    { window: '08:30 (Peak)', delayMin: 6.8, status: 'congestion', onTimeRate: 91 },
    { window: '11:00', delayMin: 2.1, status: 'nominal', onTimeRate: 98 },
    { window: '14:00', delayMin: 2.4, status: 'nominal', onTimeRate: 97 },
    { window: '17:30 (Peak)', delayMin: 5.4, status: 'congestion', onTimeRate: 93 },
    { window: '20:00', delayMin: 0.8, status: 'nominal', onTimeRate: 100 }
  ];

  // Occupancy metrics across active fleet categories
  const occupancyBreakdown = [
    { category: 'Downtown Corridor (Line 101, 21A)', percent: 74, level: 'MEDIUM', color: 'bg-primary' },
    { category: 'Tech Park Express (Line 102)', percent: 52, level: 'COMFORTABLE', color: 'bg-cyan-500' },
    { category: 'Riverside Loop (Line 204)', percent: 88, level: 'HIGH DEMAND', color: 'bg-amber-500' },
    { category: 'Suburban Line (Line 308)', percent: 32, level: 'LOW', color: 'bg-emerald-500' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 w-full">
      {/* 1. Delay Trend Panel */}
      <div className="glass-panel dark:bg-slate-850/85 rounded-3xl p-5 sm:p-6 border border-white/70 dark:border-slate-750/70 shadow-xl shadow-primary/5 dark:shadow-black/40 card-hover flex flex-col justify-between transition-colors duration-300">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <TrendingDown className="w-4 h-4" />
              </div>
              <h3 className="font-headline font-bold text-base sm:text-lg text-on-surface dark:text-slate-100">
                Delay Trend & Reliability
              </h3>
            </div>

            <span className="text-[10px] font-label font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              -18% vs Last Week
            </span>
          </div>

          <p className="text-xs text-on-surface-variant dark:text-slate-400 mb-4">
            Hourly network delay benchmarks. AI detours active on bottleneck corridors.
          </p>

          {/* Sparkline / Bar Graph Visualization for Delays */}
          <div className="space-y-2.5 font-body">
            {delayTrendData.map((d, i) => (
              <div key={i} className="flex items-center justify-between gap-2 text-xs">
                <span className="text-slate-600 dark:text-slate-300 font-medium w-28 sm:w-32 shrink-0 truncate">
                  {d.window}
                </span>

                {/* Progress bar representing delay minutes */}
                <div className="flex-1 bg-surface-container dark:bg-slate-750 rounded-full h-2 overflow-hidden mx-1">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      d.delayMin > 5 
                        ? 'bg-amber-500' 
                        : d.delayMin > 2 
                          ? 'bg-primary dark:bg-cyan-400' 
                          : 'bg-emerald-500'
                    }`} 
                    style={{ width: `${Math.min(d.delayMin * 14, 100)}%` }}
                  />
                </div>

                <div className="text-right w-16 sm:w-20 shrink-0 font-mono text-[11px]">
                  <span className={d.delayMin > 5 ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-slate-700 dark:text-slate-200'}>
                    +{d.delayMin}m avg
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 mt-4 border-t border-outline-variant/20 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>Overall Network On-Time: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">96.8%</strong></span>
          <span className="text-primary dark:text-cyan-400 font-bold">Low Delay Risk</span>
        </div>
      </div>

      {/* 2. Occupancy Indicator Panel */}
      <div className="glass-panel dark:bg-slate-850/85 rounded-3xl p-5 sm:p-6 border border-white/70 dark:border-slate-750/70 shadow-xl shadow-primary/5 dark:shadow-black/40 card-hover flex flex-col justify-between transition-colors duration-300">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary/10 dark:bg-primary/25 text-primary dark:text-cyan-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="font-headline font-bold text-base sm:text-lg text-on-surface dark:text-slate-100">
                Fleet Occupancy Indicator
              </h3>
            </div>

            <span className="text-[10px] font-label font-bold text-primary dark:text-cyan-400 bg-primary/10 dark:bg-primary/25 px-2 py-0.5 rounded-full">
              Real-Time Telemetry
            </span>
          </div>

          <p className="text-xs text-on-surface-variant dark:text-slate-400 mb-4">
            Seat utilization telemetry calculated across 118 active operating fleet buses.
          </p>

          {/* Large Kinetic Metric Gauge */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-container-low/80 dark:bg-slate-800/80 border border-outline-variant/30 dark:border-slate-700 mb-4">
            <div>
              <span className="text-[10px] font-label uppercase text-slate-400 block font-bold">Fleet Average Load</span>
              <div className="flex items-baseline gap-1">
                <AnimatedCounter 
                  value={64}
                  suffix="%"
                  className="text-2xl sm:text-3xl font-black text-primary dark:text-cyan-400"
                />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Comfort Capacity</span>
              </div>
            </div>
            <div className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold">
              ✓ Optimal Load
            </div>
          </div>

          {/* Route breakdown bars */}
          <div className="space-y-3">
            {occupancyBreakdown.map((item, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-medium text-slate-700 dark:text-slate-300 truncate pr-2">
                    {item.category}
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100 shrink-0">
                    {item.percent}%
                  </span>
                </div>
                <div className="w-full bg-surface-container dark:bg-slate-750 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-2 rounded-full ${item.color}`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 mt-4 border-t border-outline-variant/20 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>Spare Articulated Units: <strong className="text-on-surface dark:text-slate-200">12 Ready</strong></span>
          <span className="text-primary dark:text-cyan-400 font-bold">Depot Standby</span>
        </div>
      </div>
    </div>
  );
}
