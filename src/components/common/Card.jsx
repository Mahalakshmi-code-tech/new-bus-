import React from 'react';

/**
 * Standard Reusable Card Component
 */
export default function Card({
  children,
  variant = 'glass', // 'glass' | 'elevated' | 'bordered'
  className = '',
  hoverEffect = true,
  onClick,
  ...props
}) {
  const base = 'rounded-3xl p-5 sm:p-6 transition-all duration-300';
  
  const variants = {
    glass: 'glass-card dark:bg-slate-900/80 border border-white/60 dark:border-slate-800 shadow-xl',
    elevated: 'bg-surface-container-low dark:bg-slate-900 shadow-xl shadow-primary/5 dark:shadow-black/40 border border-outline-variant/30 dark:border-slate-800',
    bordered: 'bg-transparent border border-outline-variant/40 dark:border-slate-800'
  };

  const hover = hoverEffect ? 'hover:scale-[1.01] hover:shadow-2xl' : '';

  return (
    <div
      onClick={onClick}
      className={`${base} ${variants[variant] || variants.glass} ${hover} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
