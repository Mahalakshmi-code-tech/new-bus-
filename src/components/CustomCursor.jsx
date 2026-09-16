import React, { useEffect } from 'react';

/**
 * CustomCursor - Temporarily Disabled
 * ----------------------------------------------------
 * Disabled to prevent layout interference, canvas obstruction,
 * and mouse cursor suppression while ensuring the entire
 * SmartBus application renders reliably and visibly.
 */
export default function CustomCursor() {
  useEffect(() => {
    // Ensure native cursor is always visible and custom cursor classes are stripped
    document.documentElement.classList.remove('has-custom-cursor');
    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, []);

  return null;
}
