import React from 'react';

/**
 * Accessible Unread Notification Badge
 * Renders unread count with smooth scale animation, pulse ring, and ARIA label
 */
export default function NotificationBadge({ count = 0, isMobile = false }) {
  if (count <= 0) return null;

  const displayCount = count > 9 ? '9+' : count;

  if (isMobile) {
    return (
      <span
        className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5"
        aria-label={`${count} unread notifications`}
      >
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-error border border-white dark:border-slate-900" />
      </span>
    );
  }

  return (
    <span
      className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-error text-white font-bold text-[10px] leading-none flex items-center justify-center shadow-sm border border-white dark:border-slate-900 animate-in zoom-in-50 duration-200"
      aria-label={`${count} unread notifications`}
    >
      <span className="sr-only">Unread notifications count: </span>
      {displayCount}
    </span>
  );
}
