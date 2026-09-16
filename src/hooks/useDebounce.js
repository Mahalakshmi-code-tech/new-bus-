import { useState, useEffect } from 'react';

/**
 * Hook to debounce any rapidly changing value (e.g. search input)
 * @param {any} value The input value to debounce
 * @param {number} delay Delay in milliseconds (default: 250ms)
 * @returns {any} Debounced value
 */
export function useDebounce(value, delay = 250) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
