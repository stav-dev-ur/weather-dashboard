/**
 * Caching utility for API responses
 * Reduces API calls and improves performance
 */

import NodeCache from 'node-cache';

const cacheTTL = parseInt(process.env.CACHE_TTL) || 10; // minutes
const cache = new NodeCache({ stdTTL: cacheTTL * 60, checkperiod: 60 });

/**
 * Generate cache key from parameters
 */
function generateKey(prefix, params) {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  return `${prefix}:${sortedParams}`;
}

/**
 * Get value from cache
 */
function get(key) {
  const value = cache.get(key);
  if (value) {
    console.log(`[Cache] HIT: ${key}`);
  } else {
    console.log(`[Cache] MISS: ${key}`);
  }
  return value;
}

/**
 * Set value in cache
 */
function set(key, value) {
  cache.set(key, value);
  console.log(`[Cache] SET: ${key}`);
}

/**
 * Clear all cache
 */
function clear() {
  cache.flushAll();
  console.log('[Cache] Cleared all cache');
}

/**
 * Get cache statistics
 */
function stats() {
  return cache.getStats();
}

export default { get, set, generateKey, clear, stats };
