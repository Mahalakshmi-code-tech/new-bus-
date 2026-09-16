import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { flushSync } from 'react-dom';

const ThemeContext = createContext();

const THEME_STORAGE_KEY = 'smartbus-theme';

// Helper to apply classes and meta tags to the document
const applyThemeToDOM = (resolvedTheme) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (resolvedTheme === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
    root.style.colorScheme = 'dark';
    const meta = document.getElementById('meta-theme-color');
    if (meta) meta.setAttribute('content', '#0b1120');
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
    const meta = document.getElementById('meta-theme-color');
    if (meta) meta.setAttribute('content', '#faf8ff');
  }
};

export function ThemeProvider({ children }) {
  // User preference: 'light' | 'dark' | 'auto' (defaults to 'light')
  const [theme, setThemeState] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'dark' || saved === 'light' || saved === 'auto') {
        return saved;
      }
      if (saved === 'system') return 'auto';
    }
    return 'light'; // Default to Light Mode on first load
  });

  // Calculate actual applied appearance:
  // Light by default; dark only when explicitly chosen; 'auto' defaults to light appearance
  const resolvedTheme = theme === 'dark' ? 'dark' : 'light';
  const isDark = resolvedTheme === 'dark';

  // Apply to DOM whenever resolvedTheme changes
  useEffect(() => {
    applyThemeToDOM(resolvedTheme);
  }, [resolvedTheme]);

  /**
   * Change theme mode with smooth circular reveal transition
   * @param {'light' | 'dark' | 'auto'} newTheme 
   * @param {MouseEvent | TouchEvent | HTMLElement | { x: number, y: number } | null} triggerSource
   */
  const setTheme = useCallback((newTheme, triggerSource = null) => {
    const normalized = newTheme === 'system' ? 'auto' : newTheme;
    if (normalized !== 'light' && normalized !== 'dark' && normalized !== 'auto') return;

    // Persist user selection
    try {
      localStorage.setItem(THEME_STORAGE_KEY, normalized);
    } catch (e) {}

    const targetResolved = normalized === 'dark' ? 'dark' : 'light';
    const currentResolved = resolvedTheme;

    // Check prefers-reduced-motion
    const prefersReducedMotion = typeof window !== 'undefined' && 
      window.matchMedia && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // If resolved theme doesn't actually change or animation is unsupported/reduced
    if (
      targetResolved === currentResolved ||
      prefersReducedMotion ||
      typeof document === 'undefined' ||
      !document.startViewTransition
    ) {
      applyThemeToDOM(targetResolved);
      setThemeState(normalized);
      return;
    }

    // Determine circular expansion origin coordinates (x, y)
    let x = window.innerWidth / 2;
    let y = 0;

    if (triggerSource) {
      if (typeof triggerSource.clientX === 'number' && typeof triggerSource.clientY === 'number') {
        x = triggerSource.clientX;
        y = triggerSource.clientY;
      } else if (triggerSource.target && typeof triggerSource.target.getBoundingClientRect === 'function') {
        const rect = triggerSource.target.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      } else if (typeof triggerSource.getBoundingClientRect === 'function') {
        const rect = triggerSource.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      } else if (typeof triggerSource.x === 'number' && typeof triggerSource.y === 'number') {
        x = triggerSource.x;
        y = triggerSource.y;
      }
    }

    // Maximum distance from click to viewport corners
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    try {
      const transition = document.startViewTransition(() => {
        flushSync(() => {
          applyThemeToDOM(targetResolved);
          setThemeState(normalized);
        });
      });

      transition.ready.then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`
        ];
        document.documentElement.animate(
          {
            clipPath: clipPath
          },
          {
            duration: 550,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            pseudoElement: '::view-transition-new(root)'
          }
        );
      }).catch(() => {
        applyThemeToDOM(targetResolved);
        setThemeState(normalized);
      });
    } catch (e) {
      applyThemeToDOM(targetResolved);
      setThemeState(normalized);
    }
  }, [resolvedTheme]);

  // Backward-compatible toggle and cycle helper
  const toggleTheme = useCallback((triggerSource = null) => {
    const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme, triggerSource);
  }, [resolvedTheme, setTheme]);

  const cycleTheme = useCallback((triggerSource = null) => {
    const cycle = {
      light: 'dark',
      dark: 'auto',
      auto: 'light'
    };
    setTheme(cycle[theme] || 'light', triggerSource);
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      resolvedTheme, 
      isDark, 
      setTheme, 
      toggleTheme, 
      cycleTheme 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
