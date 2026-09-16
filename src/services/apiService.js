/**
 * SmartBus Resilient API Service
 * ---------------------------------------------------------------------
 * Features:
 * - In-flight request deduplication (prevents duplicate simultaneous calls)
 * - Safe response caching via memoryCache
 * - AbortController support for request cancellation
 * - Retry mechanism with exponential backoff for transient errors
 * - Sanitized, user-friendly error wrapping
 */

import { memoryCache } from './cacheService';

// In-flight active promises map for deduplication
const inFlightRequests = new Map();

/**
 * Standard fetch options
 * @typedef {Object} RequestOptions
 * @property {string} [method='GET']
 * @property {Object} [headers]
 * @property {any} [body]
 * @property {number} [ttlMs=300000] Cache duration in ms (5m default for GET)
 * @property {boolean} [useCache=true] Whether to check/store in cache (GET only)
 * @property {number} [retries=2] Retry attempts for transient failures
 * @property {number} [timeoutMs=8000] Request timeout
 * @property {AbortSignal} [signal] Optional external abort signal
 */

/**
 * Executes a resilient HTTP request
 * @param {string} url Request URL
 * @param {RequestOptions} [options={}]
 * @returns {Promise<any>}
 */
export async function apiRequest(url, options = {}) {
  const {
    method = 'GET',
    headers = {},
    body = null,
    ttlMs = 300000,
    useCache = method === 'GET',
    retries = 2,
    timeoutMs = 8000,
    signal: externalSignal
  } = options;

  const isGet = method.toUpperCase() === 'GET';
  const cacheKey = `api_${url}`;

  // 1. Check cache first if applicable
  if (isGet && useCache) {
    const cached = memoryCache.get(cacheKey);
    if (cached) {
      return cached;
    }
  }

  // 2. Request deduplication: if identical GET request is in-flight, reuse promise
  if (isGet && inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey);
  }

  const executionPromise = (async () => {
    let lastError = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      // Handle external cancellation
      if (externalSignal) {
        externalSignal.addEventListener('abort', () => controller.abort());
      }

      try {
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...headers
          },
          body: body ? (typeof body === 'string' ? body : JSON.stringify(body)) : null,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          // If server error (5xx) and retries left, wait and retry
          if (response.status >= 500 && attempt < retries) {
            await new Promise(r => setTimeout(r, 400 * Math.pow(2, attempt)));
            continue;
          }
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();

        // Cache successful GET results
        if (isGet && useCache) {
          memoryCache.set(cacheKey, data, ttlMs);
        }

        return data;
      } catch (err) {
        clearTimeout(timeoutId);
        lastError = err;

        if (err.name === 'AbortError') {
          throw new Error('The request timed out or was cancelled. Please check your network.');
        }

        // Retry on network drops
        if (attempt < retries) {
          await new Promise(r => setTimeout(r, 300 * Math.pow(2, attempt)));
        }
      }
    }

    throw new Error(
      lastError?.message || 'Unable to connect to transit server. Please try again.'
    );
  })();

  if (isGet) {
    inFlightRequests.set(cacheKey, executionPromise);
    executionPromise.finally(() => {
      inFlightRequests.delete(cacheKey);
    });
  }

  return executionPromise;
}

export default apiRequest;
