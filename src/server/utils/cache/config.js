/**
 * Set the size of the in memory LRU cache
 *
 * @type {number}
 */
export const LRU_SIZE = process.env.LRU_SIZE || 50;

/**
 * The path to the redis server
 * can be:
 * - unix_socket (recommended if redis server on same machine)
 * - url
 * - port
 *
 * @type {string|number}
 */
export const REDIS_PATH = process.env.REDIS_PATH || 'redis://localhost:6379';

/**
 * The password for the redis server
 *
 * @type {string}
 */
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
