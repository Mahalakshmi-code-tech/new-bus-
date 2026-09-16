import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Bell,
  X,
  CheckCheck,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useTransit } from '../../context/TransitContext';
import NotificationFilters from './NotificationFilters';
import NotificationItem from './NotificationItem';

/**
 * SmartBus Notification Center
 * Dual responsive layout:
 * - Desktop (>= 768px): Compact panel anchored below notification bell
 * - Mobile (< 768px): Full-width drawer sheet with safe-area padding
 */
export default function NotificationCenter({ setCurrentPage }) {
  const {
    isNotificationsOpen,
    setIsNotificationsOpen,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotification,
    setSelectedBusId
  } = useTransit();

  const [activeFilter, setActiveFilter] = useState('all');
  const panelRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    if (!isNotificationsOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsNotificationsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isNotificationsOpen, setIsNotificationsOpen]);

  // Close on outside click
  useEffect(() => {
    if (!isNotificationsOpen) return;

    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        // Check if the click target was the bell button itself (avoid immediate re-opening)
        const bellBtn = e.target.closest('[aria-label="Open notifications"]');
        if (!bellBtn) {
          setIsNotificationsOpen(false);
        }
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }, 50);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isNotificationsOpen, setIsNotificationsOpen]);

  // Compute category matching
  const isMatchCategory = (notif, category) => {
    if (category === 'all') return true;
    if (category === 'bus') {
      return notif.category === 'bus' ||
        notif.type === 'approaching' ||
        notif.type === 'stop' ||
        Boolean(notif.busId);
    }
    if (category === 'route') {
      return notif.category === 'route' ||
        notif.type === 'route_update' ||
        notif.type === 'route_changed' ||
        Boolean(notif.routeId);
    }
    if (category === 'alerts') {
      return notif.category === 'alerts' ||
        notif.type === 'delayed' ||
        notif.type === 'crowd';
    }
    return true;
  };

  // Compute category counts for filter tabs
  const filterCounts = useMemo(() => {
    return {
      all: notifications.length,
      bus: notifications.filter(n => isMatchCategory(n, 'bus')).length,
      route: notifications.filter(n => isMatchCategory(n, 'route')).length,
      alerts: notifications.filter(n => isMatchCategory(n, 'alerts')).length
    };
  }, [notifications]);

  // Filtered notifications list
  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => isMatchCategory(n, activeFilter));
  }, [notifications, activeFilter]);

  if (!isNotificationsOpen) return null;

  // Handle action navigation to existing pages without full reload
  const handleActionClick = (notification) => {
    setIsNotificationsOpen(false);

    const { action, busId, routeId } = notification;
    const targetPage = action?.page || (busId ? 'tracking' : routeId ? 'routes' : null);

    if (busId && setSelectedBusId) {
      setSelectedBusId(busId);
    }

    if (targetPage && setCurrentPage) {
      setCurrentPage(targetPage);
    }
  };

  return (
    <>
      {/* Mobile dim backdrop (< md) */}
      <div
        className="md:hidden fixed inset-0 z-50 bg-black/45 backdrop-blur-xs animate-in fade-in duration-200"
        aria-hidden="true"
        onClick={() => setIsNotificationsOpen(false)}
      />

      {/* Main Notification Center Container */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="SmartBus Transit Notification Center"
        className={`
          fixed z-50 flex flex-col bg-white dark:bg-slate-900 shadow-2xl border border-outline-variant/30 dark:border-slate-750 overflow-hidden backdrop-blur-2xl transition-all duration-300
          
          /* Mobile: Full-width bottom drawer sheet */
          inset-x-0 bottom-0 max-h-[88vh] rounded-t-3xl animate-in slide-in-from-bottom duration-300 pb-[max(1rem,env(safe-area-inset-bottom))]
          
          /* Desktop: Compact panel aligned directly below navbar notification area */
          md:inset-auto md:top-20 md:right-6 lg:right-10 md:w-[410px] md:max-h-[620px] md:rounded-3xl md:slide-in-from-top-3 md:border
        `}
      >
        {/* Mobile Drag Indicator Bar */}
        <div className="md:hidden pt-2.5 pb-1 flex justify-center">
          <div className="w-10 h-1 rounded-full bg-outline-variant/60 dark:bg-slate-700" />
        </div>

        {/* Panel Header */}
        <header className="p-4 sm:p-4.5 border-b border-outline-variant/20 dark:border-slate-800 flex items-center justify-between bg-surface-container-low/60 dark:bg-slate-850/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-primary/10 dark:bg-primary/25 text-primary dark:text-cyan-400 flex items-center justify-center relative shrink-0">
              <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-error text-white font-bold text-[8px] rounded-full flex items-center justify-center">
                  {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-headline font-bold text-sm sm:text-base text-on-surface dark:text-slate-100 flex items-center gap-2">
                <span>Transit Alerts</span>
                {unreadNotificationCount > 0 && (
                  <span className="text-[10px] font-bold text-primary dark:text-cyan-300 bg-primary/10 dark:bg-cyan-950/60 px-1.5 py-0.2 rounded-full">
                    {unreadNotificationCount} unread
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-on-surface-variant dark:text-slate-400">
                Live timetable, delays & passenger alerts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {unreadNotificationCount > 0 && (
              <button
                type="button"
                onClick={markAllNotificationsAsRead}
                className="text-[11px] font-bold text-primary dark:text-cyan-400 hover:text-primary-container dark:hover:text-cyan-300 px-2.5 py-1 rounded-lg hover:bg-primary/5 dark:hover:bg-cyan-950/40 transition-colors flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                title="Mark all notifications as read"
                aria-label="Mark all notifications as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mark All Read</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsNotificationsOpen(false)}
              className="p-1.5 rounded-xl text-on-surface-variant dark:text-slate-400 hover:text-on-surface dark:hover:text-slate-200 hover:bg-surface-container dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Close notification center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Filter Navigation Bar */}
        <div className="px-3.5 py-2.5 bg-surface-container-low/40 dark:bg-slate-900 border-b border-outline-variant/15 dark:border-slate-800">
          <NotificationFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            counts={filterCounts}
          />
        </div>

        {/* Notifications Scrollable List */}
        <main
          role="region"
          aria-label="Transit alerts list"
          className="flex-1 overflow-y-auto p-3 sm:p-3.5 space-y-2.5 overscroll-contain"
        >
          {filteredNotifications.length === 0 ? (
            /* Clean Empty State */
            <div className="py-12 sm:py-16 text-center space-y-2 px-4 animate-in fade-in duration-200">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 dark:bg-slate-800 text-primary dark:text-cyan-400 flex items-center justify-center mx-auto border border-primary/20 dark:border-slate-750">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="font-headline font-bold text-sm sm:text-base text-on-surface dark:text-slate-100">
                You're all caught up
              </p>
              <p className="text-xs text-on-surface-variant dark:text-slate-400 max-w-xs mx-auto">
                No new transit alerts right now. Active corridor arrivals and fleet updates will appear here automatically.
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <NotificationItem
                key={notif.id}
                notification={notif}
                onMarkAsRead={markNotificationAsRead}
                onClear={clearNotification}
                onActionClick={handleActionClick}
              />
            ))
          )}
        </main>

        {/* Informative Footer */}
        <footer className="px-4 py-2.5 bg-surface-container-low/60 dark:bg-slate-850/80 border-t border-outline-variant/20 dark:border-slate-800 text-center shrink-0">
          <p className="text-[10px] sm:text-[11px] text-on-surface-variant dark:text-slate-400 font-label flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-primary dark:text-cyan-400" />
            <span>Simulated fleet telemetry alerts based on scheduled headway</span>
          </p>
        </footer>
      </div>
    </>
  );
}
