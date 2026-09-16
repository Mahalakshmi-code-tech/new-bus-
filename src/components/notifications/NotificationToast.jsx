import React, { useEffect, useState } from 'react';
import {
  Bell,
  Navigation,
  AlertTriangle,
  Users,
  MapPin,
  X,
  ChevronRight
} from 'lucide-react';

/**
 * Returns type-specific styling for the toast alert
 */
function getToastIcon(type) {
  switch (type) {
    case 'approaching':
      return <Navigation className="w-4 h-4 text-primary dark:text-cyan-400" />;
    case 'delayed':
      return <AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400" />;
    case 'crowd':
      return <Users className="w-4 h-4 text-red-500 dark:text-red-400" />;
    case 'stop':
      return <MapPin className="w-4 h-4 text-cyan-500 dark:text-cyan-300" />;
    default:
      return <Bell className="w-4 h-4 text-primary dark:text-cyan-400" />;
  }
}

/**
 * Animated Notification Toast
 * Shows high-priority transit alerts with auto-dismiss and interactive actions
 */
export default function NotificationToast({ toast, onDismiss, onActionClick }) {
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!toast) return;

    const duration = 4800;
    const interval = 50;
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      if (!isHovered) {
        setProgress((prev) => {
          if (prev <= step) {
            clearInterval(timer);
            if (onDismiss) onDismiss();
            return 0;
          }
          return prev - step;
        });
      }
    }, interval);

    return () => clearInterval(timer);
  }, [toast, isHovered, onDismiss]);

  if (!toast) return null;

  const { title, message, action, type } = toast;

  return (
    <aside
      role="status"
      aria-live="polite"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-20 md:bottom-6 right-3 sm:right-6 z-50 max-w-sm w-[calc(100vw-1.5rem)] sm:w-96 bg-white dark:bg-slate-900 border border-primary/30 dark:border-cyan-500/40 rounded-2xl shadow-xl shadow-primary/10 dark:shadow-black/50 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-300 backdrop-blur-xl"
    >
      {/* Top micro progress bar */}
      <div className="h-0.5 w-full bg-surface-container-high dark:bg-slate-800">
        <div
          className="h-full bg-primary dark:bg-cyan-400 transition-all duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-3.5 sm:p-4 flex items-start gap-3">
        {/* Type Icon */}
        <div className="w-8 h-8 rounded-xl bg-primary/10 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-primary/20 dark:border-slate-700 mt-0.5">
          {getToastIcon(type)}
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <h5 className="font-bold text-xs sm:text-sm text-on-surface dark:text-slate-100 truncate">
              {title}
            </h5>
            <span className="text-[10px] font-bold text-primary dark:text-cyan-400 bg-primary/10 dark:bg-cyan-950/60 px-1.5 py-0.2 rounded shrink-0">
              Live Alert
            </span>
          </div>

          <p className="text-xs text-on-surface-variant dark:text-slate-300 leading-snug line-clamp-2">
            {message}
          </p>

          {action && (
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (onActionClick) onActionClick(toast);
                  if (onDismiss) onDismiss();
                }}
                className="text-[11px] font-bold text-primary dark:text-cyan-400 hover:underline flex items-center gap-0.5 focus:outline-none"
              >
                <span>{action.label || 'View in Tracker'}</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss toast"
          className="p-1 rounded-lg text-outline dark:text-slate-400 hover:text-on-surface dark:hover:text-slate-200 hover:bg-surface-container dark:hover:bg-slate-800 transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
