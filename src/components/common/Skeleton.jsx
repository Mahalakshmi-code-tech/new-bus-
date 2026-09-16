import React from 'react';

/**
 * Base Shimmer Primitive
 */
export function SkeletonBase({ className = '' }) {
  return (
    <div 
      className={`relative overflow-hidden bg-slate-200/80 dark:bg-slate-800/80 rounded-xl before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.8s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/40 dark:before:via-white/5 before:to-transparent ${className}`}
      aria-hidden="true"
    />
  );
}

/**
 * Full Page Route Skeleton Loader (used during lazy chunk downloads)
 */
export function PageSkeleton() {
  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 md:px-margin-desktop max-w-container-max mx-auto w-full min-h-screen space-y-8 animate-fade-up">
      {/* Header Skeleton */}
      <div className="space-y-3 max-w-xl">
        <SkeletonBase className="h-6 w-36 rounded-full" />
        <SkeletonBase className="h-10 w-3/4 rounded-2xl" />
        <SkeletonBase className="h-4 w-5/6 rounded-lg" />
      </div>

      {/* Hero / Visual Skeleton */}
      <SkeletonBase className="h-64 sm:h-80 w-full rounded-3xl" />

      {/* Grid Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}

/**
 * Reusable Card Skeleton
 */
export function CardSkeleton({ className = '' }) {
  return (
    <div className={`p-6 rounded-3xl bg-surface-container-low dark:bg-slate-900/60 border border-outline-variant/30 dark:border-slate-800 space-y-4 ${className}`}>
      <div className="flex items-center space-x-3">
        <SkeletonBase className="w-12 h-12 rounded-2xl" />
        <div className="space-y-2 flex-1">
          <SkeletonBase className="h-4 w-1/2 rounded" />
          <SkeletonBase className="h-3 w-1/3 rounded" />
        </div>
      </div>
      <SkeletonBase className="h-16 w-full rounded-2xl" />
      <div className="flex justify-between items-center pt-2">
        <SkeletonBase className="h-4 w-20 rounded" />
        <SkeletonBase className="h-8 w-24 rounded-full" />
      </div>
    </div>
  );
}

/**
 * Reusable Table / Roster Skeleton
 */
export function TableSkeleton({ rows = 4 }) {
  return (
    <div className="w-full rounded-2xl overflow-hidden border border-outline-variant/30 dark:border-slate-800 p-4 space-y-3 bg-surface-container-low dark:bg-slate-900/40">
      <SkeletonBase className="h-6 w-1/4 rounded mb-4" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center justify-between py-2 border-b border-outline-variant/10 dark:border-slate-800/60 last:border-0">
          <SkeletonBase className="h-4 w-1/3 rounded" />
          <SkeletonBase className="h-4 w-1/6 rounded" />
          <SkeletonBase className="h-4 w-1/5 rounded" />
        </div>
      ))}
    </div>
  );
}

/**
 * Reusable Map Skeleton
 */
export function MapSkeleton({ height = 'h-96' }) {
  return (
    <div className={`w-full ${height} rounded-3xl bg-slate-200 dark:bg-slate-900 border border-outline-variant/30 dark:border-slate-800 flex items-center justify-center relative overflow-hidden`}>
      <SkeletonBase className="absolute inset-0" />
      <div className="relative z-10 flex flex-col items-center space-y-3">
        <div className="w-10 h-10 rounded-full border-2 border-primary/40 border-t-primary animate-spin" />
        <span className="text-xs font-label uppercase tracking-wider text-on-surface-variant dark:text-slate-400 font-bold">
          Loading Vector Telemetry...
        </span>
      </div>
    </div>
  );
}

export default PageSkeleton;
