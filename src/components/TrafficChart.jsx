import React, { useState } from 'react';
import { TrendingUp, Users, Calendar, Clock } from 'lucide-react';

export default function TrafficChart() {
  const [timeRange, setTimeRange] = useState('today');

  const chartData = {
    today: [
      { time: '06:00', passengers: 1200, height: 28 },
      { time: '08:00', passengers: 4800, height: 92 },
      { time: '10:00', passengers: 2600, height: 52 },
      { time: '12:00', passengers: 3100, height: 62 },
      { time: '14:00', passengers: 2400, height: 48 },
      { time: '16:00', passengers: 4200, height: 84 },
      { time: '18:00', passengers: 5100, height: 100 },
      { time: '20:00', passengers: 2100, height: 42 },
      { time: '22:00', passengers: 950, height: 20 },
    ],
    week: [
      { time: 'Mon', passengers: 24200, height: 85 },
      { time: 'Tue', passengers: 25100, height: 88 },
      { time: 'Wed', passengers: 26800, height: 95 },
      { time: 'Thu', passengers: 24900, height: 87 },
      { time: 'Fri', passengers: 28400, height: 100 },
      { time: 'Sat', passengers: 16200, height: 58 },
      { time: 'Sun', passengers: 14100, height: 50 },
    ],
    month: [
      { time: 'W1', passengers: 154000, height: 80 },
      { time: 'W2', passengers: 168000, height: 88 },
      { time: 'W3', passengers: 182000, height: 95 },
      { time: 'W4', passengers: 191000, height: 100 },
    ]
  };

  const activePoints = chartData[timeRange];
  const maxVal = Math.max(...activePoints.map(p => p.passengers));

  return (
    <div className="glass-panel dark:bg-slate-900/90 rounded-3xl p-5 sm:p-7 border border-white/70 dark:border-slate-700/70 shadow-xl shadow-primary/5 dark:shadow-black/40 card-hover flex flex-col justify-between transition-colors duration-300">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-primary/10 dark:bg-primary/25 text-primary dark:text-cyan-400 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h3 className="font-headline font-bold text-lg text-on-surface dark:text-slate-100">
              Passenger Traffic Flow
            </h3>
          </div>
          <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-1">
            Real-time volume telemetry and demand forecasting
          </p>
        </div>

        {/* Time Filter Pills */}
        <div className="flex bg-surface-container-low dark:bg-slate-800 p-1 rounded-2xl border border-outline-variant/30 dark:border-slate-700 self-start sm:self-auto">
          {[
            { id: 'today', label: 'Today' },
            { id: 'week', label: 'Week' },
            { id: 'month', label: 'Month' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTimeRange(t.id)}
              className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                timeRange === t.id
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-cyan-400'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Bezier & Bar Visualization Area */}
      <div className="relative pt-4 pb-2">
        {/* SVG Bezier Line Curve */}
        <div className="h-44 sm:h-52 w-full relative">
          <svg 
            className="w-full h-full overflow-visible" 
            viewBox="0 0 600 160" 
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0066ff" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0066ff" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid Guideline */}
            <line x1="0" y1="40" x2="600" y2="40" className="stroke-slate-200 dark:stroke-slate-800" strokeDasharray="3 3" />
            <line x1="0" y1="80" x2="600" y2="80" className="stroke-slate-200 dark:stroke-slate-800" strokeDasharray="3 3" />
            <line x1="0" y1="120" x2="600" y2="120" className="stroke-slate-200 dark:stroke-slate-800" strokeDasharray="3 3" />

            {/* Shaded Area under Curve */}
            <path
              d={`
                M 0 160 
                ${activePoints.map((pt, i) => {
                  const x = (i / (activePoints.length - 1)) * 600;
                  const y = 150 - (pt.height * 1.3);
                  return `L ${x} ${y}`;
                }).join(' ')} 
                L 600 160 Z
              `}
              fill="url(#chartGradient)"
            />

            {/* Bezier Stroke Line */}
            <path
              d={`
                M 0 ${150 - (activePoints[0].height * 1.3)} 
                ${activePoints.slice(1).map((pt, i) => {
                  const x = ((i + 1) / (activePoints.length - 1)) * 600;
                  const y = 150 - (pt.height * 1.3);
                  return `L ${x} ${y}`;
                }).join(' ')}
              `}
              fill="none"
              stroke="currentColor"
              className="text-primary dark:text-cyan-400"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Data Point Nodes */}
            {activePoints.map((pt, i) => {
              const x = (i / (activePoints.length - 1)) * 600;
              const y = 150 - (pt.height * 1.3);
              return (
                <g key={i} className="group cursor-pointer">
                  <circle cx={x} cy={y} r="5" className="fill-white dark:fill-slate-900 stroke-primary dark:stroke-cyan-400 transition-transform group-hover:scale-150" strokeWidth="2.5" />
                  <circle cx={x} cy={y} r="2" fill="#00ffff" />
                </g>
              );
            })}
          </svg>
        </div>

        {/* X-Axis Labels */}
        <div className="flex justify-between items-center text-[10px] sm:text-xs text-on-surface-variant dark:text-slate-400 font-label mt-2 px-1">
          {activePoints.map((pt, i) => (
            <span key={i} className="font-semibold">{pt.time}</span>
          ))}
        </div>
      </div>

      {/* Summary Footer */}
      <div className="mt-4 pt-3 border-t border-outline-variant/30 dark:border-slate-800 flex justify-between items-center text-xs">
        <span className="text-on-surface-variant dark:text-slate-400 font-medium">
          Peak Period: <strong className="text-on-surface dark:text-slate-200">18:00 (5.1k commuters)</strong>
        </span>
        <span className="text-primary dark:text-cyan-400 font-bold">
          +14% vs avg week
        </span>
      </div>
    </div>
  );
}
