/**
 * SmartBus In-Memory Cache Service
 * Provides TTL-based caching with LRU-style eviction to prevent duplicate requests
 * and optimize data fetching under high traffic.
 */

class CacheService {
  constructor(maxSize = 150) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  /**
   * Sets a key-value pair in cache with expiration
   * @param {string} key Cache key
   * @param {any} value Value to store
   * @param {number} ttlMs Time to live in milliseconds (default: 5 minutes)
   */
  set(key, value, ttlMs = 5 * 60 * 1000) {
    if (this.cache.size >= this.maxSize) {
      // Evict oldest entry (Map maintains insertion order)
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    const expiresAt = Date.now() + ttlMs;
    this.cache.set(key, { value, expiresAt });
  }

  /**
   * Retrieves a cached value if present and not expired
   * @param {string} key Cache key
   * @returns {any|null}
   */
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    // Refresh position for LRU
    this.cache.delete(key);
    this.cache.set(key, entry);

    return entry.value;
  }

  /**
   * Checks if key exists and is valid
   */
  has(key) {
    return this.get(key) !== null;
  }

  /**
   * Deletes a specific key
   */
  delete(key) {
    return this.cache.delete(key);
  }

  /**
   * Clears all cached items or all items matching a namespace prefix
   * @param {string} [prefix] Optional prefix (e.g. 'routes_')
   */
  clear(prefix) {
    if (!prefix) {
      this.cache.clear();
      return;
    }
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Number of active items in cache
   */
  get size() {
    return this.cache.size;
  }
}

export const memoryCache = new CacheService();
export default memoryCache;
