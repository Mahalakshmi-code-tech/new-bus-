import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Standard Reusable Button Component
 */
export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  isLoading = false,
  disabled = false,
  icon: Icon,
  className = '',
  type = 'button',
  onClick,
  ...props
}) {
  const baseClasses = 'inline-flex items-center justify-center font-bold rounded-full transition-all duration-200 active:scale-95 focus:outline-none disabled:opacity-50 disabled:pointer-events-none';

  const sizeClasses = {
    sm: 'px-3.5 py-2 text-xs gap-1.5 min-h-[36px]',
    md: 'px-5 py-2.5 text-xs sm:text-sm gap-2 min-h-[44px]',
    lg: 'px-7 py-3.5 text-sm sm:text-base gap-2.5 min-h-[48px]'
  };

  const variantClasses = {
    primary: 'btn-primary shadow-md shadow-primary/20 hover:shadow-cyan-400/30',
    secondary: 'bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80',
    ghost: 'bg-transparent hover:bg-surface-container-high dark:hover:bg-slate-800 text-on-surface dark:text-slate-200',
    outline: 'border border-outline-variant/50 dark:border-slate-700 bg-transparent hover:bg-surface-container-low dark:hover:bg-slate-800 text-on-surface dark:text-slate-100',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/20'
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${variantClasses[variant] || variantClasses.primary} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      <span>{children}</span>
    </button>
  );
}
