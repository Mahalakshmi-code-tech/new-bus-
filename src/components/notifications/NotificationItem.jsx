import React from 'react';
import {
  Navigation,
  AlertTriangle,
  Users,
  MapPin,
  Sparkles,
  Star,
  Clock,
  Trash2,
  ChevronRight,
  Check
} from 'lucide-react';

/**
 * Returns icon, accent badge, and color mapping per notification type
 */
function getTypeConfig(type, isFavorite) {
  if (isFavorite) {
    return {
      icon: Star,
      iconBg: 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/40',
      badgeText: 'Favorite',
      badgeBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/40'
    };
  }

  switch (type) {
    case 'approaching':
      return {
        icon: Navigation,
        iconBg: 'bg-primary/10 dark:bg-primary/25 text-primary dark:text-cyan-400 border-primary/20 dark:border-cyan-500/30',
        badgeText: 'Approaching',
        badgeBg: 'bg-blue-50 dark:bg-blue-950/40 text-primary dark:text-cyan-300 border-primary/20 dark:border-cyan-800/40'
      };
    case 'delayed':
      return {
        icon: AlertTriangle,
        iconBg: 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/40',
        badgeText: 'Delay Alert',
        badgeBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/40'
      };
    case 'crowd':
      return {
        icon: Users,
        iconBg: 'bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/40',
        badgeText: 'High Occupancy',
        badgeBg: 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800/40'
      };
    case 'stop':
      return {
        icon: MapPin,
        iconBg: 'bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/40',
        badgeText: 'Destination',
        badgeBg: 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/40'
      };
    case 'route_update':
    case 'route_changed':
      return {
        icon: Sparkles,
        iconBg: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/40',
        badgeText: 'Route Advisory',
        badgeBg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/40'
      };
    case 'announcement':
    default:
      return {
        icon: Sparkles,
        iconBg: 'bg-surface-container-high dark:bg-slate-800 text-on-surface-variant dark:text-slate-300 border-outline-variant/30 dark:border-slate-700',
        badgeText: 'Transit Notice',
        badgeBg: 'bg-surface-container-low dark:bg-slate-800 text-on-surface-variant dark:text-slate-400 border-outline-variant/20 dark:border-slate-700'
      };
  }
}

/**
 * Single Accessible Notification Card Component
 */
export default function NotificationItem({
  notification,
  onMarkAsRead,
  onClear,
  onActionClick
}) {
  const {
    id,
    type,
    title,
    message,
    timestamp,
    read,
    busId,
    busNumber,
    routeNumber,
    isFavorite,
    action
  } = notification;

  const typeConfig = getTypeConfig(type, isFavorite);
  const Icon = typeConfig.icon;

  const handleCardClick = () => {
    if (!read && onMarkAsRead) {
      onMarkAsRead(id);
    }
  };

  const handleAction = (e) => {
    e.stopPropagation();
    if (!read && onMarkAsRead) {
      onMarkAsRead(id);
    }
    if (onActionClick) {
      onActionClick(notification);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onClear) {
      onClear(id);
    }
  };

  return (
    <article
      onClick={handleCardClick}
      aria-label={`${read ? 'Read' : 'Unread'} alert: ${title}. ${message}`}
      className={`relative p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer select-none group focus-within:ring-2 focus-within:ring-primary dark:focus-within:ring-cyan-400 ${
        !read
          ? 'bg-white dark:bg-slate-800/95 border-primary/25 dark:border-cyan-500/40 shadow-xs hover:border-primary/45 dark:hover:border-cyan-400'
          : 'bg-surface-container-low/50 dark:bg-slate-850/60 border-outline-variant/25 dark:border-slate-800/80 opacity-80 hover:opacity-100 hover:bg-surface-container-low dark:hover:bg-slate-800/70'
      }`}
    >
      {/* Unread Visual Indicator (Subtle electric cyan / blue dot) */}
      {!read && (
        <span
          className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-primary dark:bg-cyan-400 ring-4 ring-primary/10 dark:ring-cyan-400/20"
          title="Unread alert"
          aria-hidden="true"
        />
      )}

      <div className="flex items-start gap-3">
        {/* Type Icon */}
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border mt-0.5 transition-transform duration-200 group-hover:scale-105 ${typeConfig.iconBg}`}
          aria-hidden="true"
        >
          <Icon className="w-4.5 h-4.5" />
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center flex-wrap gap-1.5 mb-1">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${typeConfig.badgeBg}`}
            >
              {typeConfig.badgeText}
            </span>

            {(busNumber || routeNumber) && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-surface-container-high dark:bg-slate-750 text-on-surface dark:text-slate-200 border border-outline-variant/30 dark:border-slate-700">
                {busNumber ? busNumber : `Route ${routeNumber}`}
              </span>
            )}
          </div>

          <h4 className="font-bold text-xs sm:text-sm text-on-surface dark:text-slate-100 leading-snug">
            {title}
          </h4>

          <p className="text-xs text-on-surface-variant dark:text-slate-300 mt-1 leading-relaxed line-clamp-2 sm:line-clamp-3">
            {message}
          </p>

          {/* Bottom Metas & Actions */}
          <div className="mt-3 pt-2.5 flex items-center justify-between gap-2 border-t border-outline-variant/15 dark:border-slate-800">
            <span className="text-[11px] text-outline dark:text-slate-400 flex items-center gap-1 font-medium">
              <Clock className="w-3 h-3" />
              <span>{timestamp}</span>
            </span>

            <div className="flex items-center gap-2">
              {/* Action Button */}
              {action && (
                <button
                  type="button"
                  onClick={handleAction}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-primary/10 dark:bg-cyan-950/60 text-primary dark:text-cyan-300 hover:bg-primary/20 dark:hover:bg-cyan-900/60 border border-primary/20 dark:border-cyan-500/30 transition-all flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <span>{action.label || 'View'}</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}

              {/* Clear / Delete Button */}
              <button
                type="button"
                onClick={handleDelete}
                title="Dismiss notification"
                aria-label="Dismiss notification"
                className="p-1 rounded-md text-outline dark:text-slate-400 hover:text-error dark:hover:text-red-400 hover:bg-error/10 dark:hover:bg-red-950/40 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-error"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
