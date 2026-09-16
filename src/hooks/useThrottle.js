import { useState, useEffect, useRef } from 'react';

/**
 * Hook to throttle rapidly updating values (e.g. scroll positions, GPS tick intervals)
 * @param {any} value Input value
 * @param {number} limit Time window in milliseconds (default: 300ms)
 * @returns {any} Throttled value
 */
export function useThrottle(value, limit = 300) {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
}

export default useThrottle;
