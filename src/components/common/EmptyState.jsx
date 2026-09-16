import React from 'react';
import { SearchX, ArrowRight, RefreshCw } from 'lucide-react';

/**
 * Reusable EmptyState component
 */
export default function EmptyState({
  icon: Icon = SearchX,
  title = 'No Transit Results Found',
  description = 'We could not locate any active buses or routes matching your search criteria.',
  actionLabel,
  onAction,
  className = ''
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-3xl bg-surface-container-low dark:bg-slate-900/60 border border-outline-variant/30 dark:border-slate-800 space-y-4 animate-fade-up ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary dark:text-cyan-400 flex items-center justify-center shadow-inner">
        <Icon className="w-8 h-8" />
      </div>

      <div className="space-y-1.5 max-w-sm">
        <h3 className="font-headline font-bold text-lg text-on-surface dark:text-slate-100">
          {title}
        </h3>
        <p className="font-body text-xs sm:text-sm text-on-surface-variant dark:text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-bold btn-primary shadow-md active:scale-95 transition-all mt-2"
        >
          <span>{actionLabel}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
