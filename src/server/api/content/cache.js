import LRU from 'lru-cache';
import {createClient} from 'redis';

const lru = LRU(50);
const redis = createClient();

redis.on('error', error => console.log(error.toString()));
redis.on('connect', () => {
  console.log('Content API Redis Cache Connected');

  if (process.env.NODE_ENV === 'development') {
    console.log('Content API Redis Cache Flushed for Development');
    redis.flushall();
  }
});


/**
 * Get the content API cache key for the given resource
 *
 * @param resource
 * @returns {string}
 */
function getContentAPICacheKey(resource) {
  return `api:content:${resource}`;
}


/**
 * Save the given object to the cache for the given
 * resource identifier. Making sure to JSON stringify
 * it for the redis cache
 *
 * @param resource
 * @param response
 * @returns {void}
 */
export function putResponseInCache(resource, response) {
  const key = getContentAPICacheKey(resource);

  lru.set(key, response);
  redis.set(key, JSON.stringify(response));
}


/**
 * Try to get the resource value from the current content
 * API cache, first checking the local memory cache and
 * falling back to the redis cache
 *
 * @param resource
 * @returns {Promise}
 */
export async function getResponseFromCache(resource) {
  const key = getContentAPICacheKey(resource);

  const response = lru.get(key);
  if (response) {
    return response;
  }

  if (!redis.connected) {
    return null;
  }

  return new Promise(resolve =>
    redis.get(key, (error, response) => {
      let finalResponse;
      try {
        finalResponse = JSON.parse(response);
      } catch (e) {
        finalResponse = response;
      }

      resolve(error || !finalResponse ? null : finalResponse);
    })
  );
}
