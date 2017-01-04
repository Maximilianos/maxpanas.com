/**
 * The cache database! so performant
 * so wow
 *
 * TODO: replace with a persistent well supported cache implementation like redis
 *
 * @type {{}}
 */
const cache = {};


/**
 * Create or update an entry in the cache
 *
 * @param key
 * @param value
 * @returns {*}
 */
function put(key, value) {
  return (cache[key] = value);
}


/**
 * Retrieve an entry from the cache
 *
 * @param key
 * @returns {*}
 */
function get(key) {
  return cache[key];
}


/**
 * Delete an entry in the cache
 *
 * @param key
 * @returns {boolean}
 */
function del(key) {
  return delete cache[key];
}


/**
 * Export the cache interaction API
 */
export default {
  put, get, del
};


/**
 * Express middleware for retrieving cached responses
 * for given request urls
 *
 * @param url
 * @param res
 * @param next
 */
export function cacheMiddleware({url}, res, next) {
  const cached = get(url);
  if (!cached) {
    next();
    return;
  }

  res.send(cached);
}
