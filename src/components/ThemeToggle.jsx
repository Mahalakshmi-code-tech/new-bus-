import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor, ChevronDown, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const THEME_OPTIONS = [
  {
    id: 'light',
    label: 'Light',
    icon: Sun,
    iconColor: 'text-amber-500',
    animClass: 'theme-icon-sun-active',
    glowClass: 'hover:shadow-[0_0_12px_rgba(245,158,11,0.35)] hover:border-amber-400/50'
  },
  {
    id: 'dark',
    label: 'Dark',
    icon: Moon,
    iconColor: 'text-cyan-400',
    animClass: 'theme-icon-moon-active',
    glowClass: 'hover:shadow-[0_0_12px_rgba(0,255,255,0.35)] hover:border-cyan-400/50'
  },
  {
    id: 'auto',
    label: 'Auto / System',
    icon: Monitor,
    iconColor: 'text-blue-500 dark:text-blue-400',
    animClass: 'theme-icon-system-active',
    glowClass: 'hover:shadow-[0_0_12px_rgba(59,130,246,0.35)] hover:border-blue-400/50'
  }
];

export default function ThemeToggle({
  variant = 'navbar',
  className = ''
}) {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);

  // Normalize current theme (handle legacy 'system')
  const currentThemeId = theme === 'system' ? 'auto' : theme;
  const currentOption = THEME_OPTIONS.find((opt) => opt.id === currentThemeId) || THEME_OPTIONS[0];
  const ActiveIcon = currentOption.icon;

  // Handle outside click and Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (optionId, e) => {
    setTheme(optionId, e);
    setIsOpen(false);
  };

  /* ==================================================
     SIDEBAR / DRAWER FULL-WIDTH PILL VARIANT
     ================================================== */
  if (variant === 'pill') {
    return (
      <div className={`relative w-full ${className}`} ref={containerRef}>
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={`Theme Selector, currently ${currentOption.label}`}
          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 border focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary active:scale-98 select-none ${
            isOpen
              ? 'bg-surface-container dark:bg-slate-750 border-primary/40 dark:border-cyan-500/40 shadow-sm'
              : 'bg-surface-container-low dark:bg-slate-800/90 hover:bg-surface-container dark:hover:bg-slate-750 border-outline-variant/40 dark:border-slate-700/80 text-on-surface dark:text-slate-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <ActiveIcon className={`w-4 h-4 ${currentOption.iconColor}`} />
            <span>Theme</span>
            <span className="text-[11px] font-normal text-on-surface-variant dark:text-slate-400">
              ({currentOption.label})
            </span>
          </div>

          <ChevronDown
            className={`w-3.5 h-3.5 text-on-surface-variant dark:text-slate-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : 'rotate-0'
            }`}
          />
        </button>

        {/* Animated Dropdown Menu */}
        <div
          role="listbox"
          aria-label="Theme options"
          className={`absolute left-0 right-0 mt-1.5 p-1.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-outline-variant/40 dark:border-slate-800 shadow-2xl shadow-primary/10 dark:shadow-black/50 z-50 transition-all duration-200 ease-out origin-top ${
            isOpen
              ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
              : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
          }`}
        >
          {THEME_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isSelected = currentThemeId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={(e) => handleSelect(opt.id, e)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors duration-150 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary ${
                  isSelected
                    ? 'bg-primary/10 dark:bg-primary/25 text-primary dark:text-cyan-400 font-bold'
                    : 'text-on-surface dark:text-slate-200 hover:bg-surface-container dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${opt.iconColor} ${isSelected ? opt.animClass : ''}`} />
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-primary dark:text-cyan-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  /* ==================================================
     NAVBAR ICON-ONLY COMPACT BUTTON & DROPDOWN
     ================================================== */
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`} ref={containerRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Theme Selector. Current theme: ${currentOption.label}. Click to choose Light, Dark, or Auto.`}
        title={`Theme: ${currentOption.label} • Click to switch`}
        className={`group relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-all duration-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary select-none active:scale-90 shadow-xs ${currentOption.glowClass} ${
          isOpen
            ? 'bg-surface-container dark:bg-slate-750 border-primary/50 dark:border-cyan-400/50 ring-2 ring-primary/20 dark:ring-cyan-500/20 shadow-md scale-95'
            : 'bg-surface-container-low/90 dark:bg-slate-800/90 hover:bg-surface-container dark:hover:bg-slate-750 text-on-surface dark:text-slate-200 border-outline-variant/30 dark:border-slate-700/80 hover:shadow-sm'
        }`}
      >
        {/* Dynamic Theme Icon with smooth rotation/transition */}
        <ActiveIcon
          key={currentThemeId}
          className={`w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 transition-all duration-300 group-hover:scale-110 ${currentOption.iconColor} ${currentOption.animClass}`}
        />

        {/* Floating Tooltip on Hover (hidden on touch/mobile, shown on hover when closed) */}
        {!isOpen && (
          <div
            role="tooltip"
            className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 rounded-lg bg-slate-900/95 dark:bg-slate-800/95 text-white text-[11px] font-medium whitespace-nowrap opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 ease-out shadow-lg border border-white/10 z-50 backdrop-blur-md hidden sm:block"
          >
            <span>{currentOption.label} Mode</span>
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-slate-900/95 dark:bg-slate-800/95 border-t border-l border-white/10" />
          </div>
        )}
      </button>

      {/* Animated Dropdown Menu with 200ms-250ms smooth fade/slide/scale */}
      <div
        role="listbox"
        aria-label="Theme options"
        className={`absolute right-0 top-full mt-2 w-36 sm:w-40 p-1.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-outline-variant/40 dark:border-slate-800 shadow-2xl shadow-primary/10 dark:shadow-black/50 z-50 transition-all duration-200 ease-out origin-top-right ${
          isOpen
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
            : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
        }`}
      >
        <div className="px-2.5 py-1 text-[10px] font-label font-bold uppercase tracking-wider text-on-surface-variant/80 dark:text-slate-400 border-b border-outline-variant/20 dark:border-slate-800 mb-1">
          Theme Mode
        </div>

        {THEME_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isSelected = currentThemeId === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              role="option"
              aria-selected={isSelected}
              onClick={(e) => handleSelect(opt.id, e)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors duration-150 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary ${
                isSelected
                  ? 'bg-primary/10 dark:bg-primary/25 text-primary dark:text-cyan-400 font-bold'
                  : 'text-on-surface dark:text-slate-200 hover:bg-surface-container dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 ${opt.iconColor} ${isSelected ? opt.animClass : ''}`}
                />
                <span>{opt.label}</span>
              </div>
              {isSelected && (
                <Check className="w-3.5 h-3.5 text-primary dark:text-cyan-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
