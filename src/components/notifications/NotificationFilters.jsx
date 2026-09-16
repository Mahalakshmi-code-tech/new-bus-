import React from 'react';

const FILTER_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'bus', label: 'Bus' },
  { id: 'route', label: 'Route' },
  { id: 'alerts', label: 'Alerts' }
];

/**
 * Notification Center Filter Pills
 * Renders compact [All] [Bus] [Route] [Alerts] filter tabs with counts
 */
export default function NotificationFilters({
  activeFilter = 'all',
  onFilterChange,
  counts = { all: 0, bus: 0, route: 0, alerts: 0 }
}) {
  return (
    <div
      role="tablist"
      aria-label="Filter notifications by category"
      className="flex items-center gap-1.5 p-1 bg-surface-container-low dark:bg-slate-800/70 rounded-xl border border-outline-variant/20 dark:border-slate-700/60"
    >
      {FILTER_OPTIONS.map((f) => {
        const isActive = activeFilter === f.id;
        const count = counts[f.id] ?? 0;

        return (
          <button
            key={f.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${f.id}`}
            id={`tab-${f.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onFilterChange(f.id)}
            className={`flex-1 min-h-[32px] px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-cyan-400 ${
              isActive
                ? 'bg-white dark:bg-slate-700 text-primary dark:text-cyan-400 shadow-xs font-bold border border-outline-variant/30 dark:border-slate-600'
                : 'text-on-surface-variant dark:text-slate-400 hover:text-on-surface dark:hover:text-slate-200 hover:bg-surface-container/50 dark:hover:bg-slate-750'
            }`}
          >
            <span>{f.label}</span>
            {count > 0 && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isActive
                    ? 'bg-primary/10 dark:bg-cyan-400/20 text-primary dark:text-cyan-300'
                    : 'bg-surface-container-high dark:bg-slate-700 text-on-surface-variant dark:text-slate-400'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
