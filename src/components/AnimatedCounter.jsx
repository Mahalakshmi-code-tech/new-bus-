import React, { useEffect, useState, useRef } from 'react';

/**
 * AnimatedCounter component
 * Animates numerical values smoothly from 0 (or start) to target value using requestAnimationFrame.
 */
export default function AnimatedCounter({ 
  value, 
  duration = 1400, 
  decimals = 0, 
  prefix = '', 
  suffix = '',
  className = ''
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const targetVal = typeof value === 'number' ? value : parseFloat(value) || 0;
  const startTimestampRef = useRef(null);
  const startValRef = useRef(0);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    let animationFrameId;
    const startVal = startValRef.current;
    startTimestampRef.current = null;

    // Standard easeOutQuart easing for smooth, premium kinetic decelerating motion
    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

    const step = (timestamp) => {
      if (!startTimestampRef.current) startTimestampRef.current = timestamp;
      const progress = Math.min((timestamp - startTimestampRef.current) / duration, 1);
      const easedProgress = easeOutQuart(progress);
      
      const current = startVal + (targetVal - startVal) * easedProgress;
      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setDisplayValue(targetVal);
        startValRef.current = targetVal;
        hasAnimatedRef.current = true;
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [targetVal, duration]);

  const formattedValue = decimals > 0 
    ? displayValue.toFixed(decimals) 
    : Math.round(displayValue).toLocaleString();

  return (
    <span className={`inline-block font-headline tracking-tight ${className}`}>
      {prefix}{formattedValue}{suffix}
    </span>
  );
}
