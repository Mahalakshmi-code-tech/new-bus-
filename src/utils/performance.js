/**
 * SmartBus Performance Utility
 * Safe, lightweight performance measurement and Web Vitals tracking.
 */

/**
 * Measures execution time of an asynchronous function
 * @param {string} label Identifier
 * @param {Function} asyncFn Function returning a promise
 * @returns {Promise<any>} Result
 */
export async function measureAsync(label, asyncFn) {
  const start = performance.now();
  try {
    const result = await asyncFn();
    const duration = Math.round(performance.now() - start);
    if (import.meta.env?.DEV) {
      console.debug(`[Perf] ${label}: ${duration}ms`);
    }
    return result;
  } catch (error) {
    const duration = Math.round(performance.now() - start);
    console.warn(`[Perf Error] ${label} failed after ${duration}ms:`, error.message);
    throw error;
  }
}

/**
 * Creates a debounced callback
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Creates a throttled callback
 */
export function throttle(func, limit = 200) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
