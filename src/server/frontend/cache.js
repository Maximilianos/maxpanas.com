import {createClient} from 'redis';


const cache = createClient();

cache.on('error', error => console.log(error));
cache.on('connect', () => console.log('App Cache Connected'));


/**
 * Get the page cache key for a given url
 *
 * @param url
 * @returns {string}
 */
function getPageCacheKey(url) {
  return `frontend:page:${url}`;
}


/**
 * Save the given html into the cache for the
 * given url
 *
 * @param url
 * @param html
 */
export function cachePage(url, html) {
  const key = getPageCacheKey(url);

  cache.set(key, html);
}


/**
 * Try to get the html for the current page from the
 * cache. Only call the next handler in the chain if
 * the page does not exist in cache or there is an
 * error retrieving it
 *
 * @param url
 * @param res
 * @param next
 */
export function pageCacheMiddleware({url}, res, next) {
  const key = getPageCacheKey(url);

  cache.get(key, (error, html) => {
    if (error || !html) {
      next();
      return;
    }

    res.send(html);
  });
}
