import React, { useState } from 'react';
import { 
  Bell, 
  X, 
  CheckCheck, 
  Trash2, 
  Clock, 
  AlertTriangle, 
  Navigation, 
  Sparkles, 
  CheckCircle2,
  Filter
} from 'lucide-react';
import { useTransit } from '../context/TransitContext';

export default function NotificationCenterModal({ setCurrentPage }) {
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

  if (!isNotificationsOpen) return null;

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'approaching') return n.type === 'approaching';
    if (activeFilter === 'delayed') return n.type === 'delayed';
    if (activeFilter === 'announcements') return n.type === 'announcement' || n.type === 'route_changed';
    return true;
  });

  const handleTrackBus = (busId) => {
    if (busId) {
      setSelectedBusId(busId);
      setIsNotificationsOpen(false);
      if (setCurrentPage) setCurrentPage('tracking');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'approaching':
        return <Navigation className="w-4 h-4 text-primary dark:text-cyan-400" />;
      case 'delayed':
        return <AlertTriangle className="w-4 h-4 text-tertiary dark:text-amber-400" />;
      case 'route_changed':
        return <Sparkles className="w-4 h-4 text-cyan-500" />;
      case 'announcement':
      default:
        return <Bell className="w-4 h-4 text-primary dark:text-cyan-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 md:p-10 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-outline-variant/30 dark:border-slate-750 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-label="Smart Transit Notification Center"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-outline-variant/30 dark:border-slate-800 flex items-center justify-between bg-surface-container-low/50 dark:bg-slate-850">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-primary/10 dark:bg-primary/25 text-primary dark:text-cyan-400 flex items-center justify-center relative">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-error text-white font-bold text-[9px] rounded-full flex items-center justify-center animate-pulse">
                  {unreadNotificationCount}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-headline font-bold text-base sm:text-lg text-on-surface dark:text-slate-100">
                Transit Alerts Center
              </h3>
              <p className="text-[11px] text-on-surface-variant dark:text-slate-400">
                Live timetable, delay, and arrival dispatches
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsNotificationsOpen(false)}
            className="p-1.5 rounded-xl text-on-surface-variant dark:text-slate-400 hover:text-on-surface dark:hover:text-slate-200 hover:bg-surface-container dark:hover:bg-slate-800 transition-colors"
            aria-label="Close notification center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills Bar & Mark All as Read */}
        <div className="px-4 py-2.5 bg-surface-container-low/80 dark:bg-slate-900 border-b border-outline-variant/20 dark:border-slate-800 flex items-center justify-between gap-2 overflow-x-auto hide-scrollbar">
          <div className="flex items-center space-x-1.5">
            {[
              { id: 'all', label: 'All Alerts' },
              { id: 'approaching', label: 'Approaching' },
              { id: 'delayed', label: 'Delays' },
              { id: 'announcements', label: 'Announcements' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  activeFilter === f.id
                    ? 'bg-primary text-white dark:bg-cyan-500 dark:text-slate-950 font-bold shadow-xs'
                    : 'text-on-surface-variant dark:text-slate-400 hover:bg-surface-container dark:hover:bg-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {unreadNotificationCount > 0 && (
            <button
              onClick={markAllNotificationsAsRead}
              className="text-[11px] font-bold text-primary dark:text-cyan-400 hover:underline flex items-center gap-1 shrink-0 ml-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark All Read</span>
            </button>
          )}
        </div>

        {/* Alerts List */}
        <div className="p-3 sm:p-4 overflow-y-auto flex-1 space-y-2.5 hide-scrollbar">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-primary/40 dark:text-cyan-400/40 mx-auto" />
              <p className="font-headline font-bold text-sm text-on-surface dark:text-slate-200">
                All caught up!
              </p>
              <p className="text-xs text-on-surface-variant dark:text-slate-400">
                No active notifications in this category.
              </p>
            </div>
          ) : (
            filteredNotifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => markNotificationAsRead(notif.id)}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all relative group card-hover cursor-pointer ${
                  !notif.read
                    ? 'bg-primary/5 dark:bg-slate-800/90 border-primary/30 dark:border-cyan-500/40'
                    : 'bg-surface-container-low/40 dark:bg-slate-850/60 border-outline-variant/30 dark:border-slate-800 opacity-80'
                }`}
              >
                {/* Unread indicator dot */}
                {!notif.read && (
                  <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-primary dark:bg-cyan-400 animate-pulse" />
                )}

                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-xl bg-surface-container dark:bg-slate-800 shadow-xs shrink-0 mt-0.5">
                    {getNotificationIcon(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0 pr-4">
                    <h4 className="font-bold text-xs sm:text-sm text-on-surface dark:text-slate-100 flex items-center gap-1.5">
                      <span>{notif.title}</span>
                    </h4>
                    <p className="text-xs text-on-surface-variant dark:text-slate-300 mt-1 leading-relaxed">
                      {notif.message}
                    </p>

                    <div className="mt-2.5 flex items-center justify-between gap-2 pt-2 border-t border-outline-variant/20 dark:border-slate-750/50">
                      <span className="text-[10px] font-label text-outline dark:text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{notif.timestamp}</span>
                      </span>

                      <div className="flex items-center space-x-2">
                        {notif.busId && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTrackBus(notif.busId);
                            }}
                            className="text-[11px] font-bold text-primary dark:text-cyan-400 hover:underline bg-primary/10 dark:bg-primary/25 px-2.5 py-1 rounded-lg transition-colors"
                          >
                            Track Bus
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            clearNotification(notif.id);
                          }}
                          className="p-1 text-outline dark:text-slate-400 hover:text-error dark:hover:text-red-400 transition-colors"
                          title="Delete notification"
                          aria-label="Delete notification"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-surface-container dark:bg-slate-800 border-t border-outline-variant/20 dark:border-slate-750 text-center">
          <p className="text-[11px] text-on-surface-variant dark:text-slate-400 font-label">
            Notifications are generated automatically via live bus transponders
          </p>
        </div>
      </div>
    </div>
  );
}
