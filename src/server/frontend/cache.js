import LRU from 'lru-cache';
import {createClient} from 'redis';
import moment from 'moment';


const lru = LRU(50);
const redis = createClient();

redis.on('error', error => console.log(error.toString()));
redis.on('connect', () => {
  console.log('App Redis Cache Connected');

  // flush the cache whenever the server restarts in development
  // mode because it is very likely that code has changed that will
  // affect how pages should be rendered
  if (process.env.NODE_ENV === 'development') {
    console.log('App Redis Cache Flushed for Development');
    redis.flushall();
  }
});


/**
 * Get the page cache key for a given url
 *
 * @param url
 * @returns {string}
 */
function getPageCacheKey(url) {
  return `frontend:${url}`;
}


/**
 * Save the given html into the cache for the
 * given url and set an appropriate expiry time
 * for the given url
 *
 * @param url
 * @param html
 */
export function cachePage(url, html) {
  const key = getPageCacheKey(url);

  const expiry = getPageTimeToExpiry(url);

  lru.set(key, html, expiry);

  redis.set(key, html);

  // redis expiry expects ttl in seconds not milliseconds, so need to
  // convert. Math.ceil is used to make sure the cache is always updated
  // AFTER the expiry date has passed
  redis.expire(key, Math.ceil(expiry / 1000));
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

  const html = lru.get(key);
  if (html) {
    res.send(html);
    return;
  }

  if (!redis.connected) {
    next();
    return;
  }

  redis.get(key, (error, html) => {
    if (error || !html) {
      next();
      return;
    }

    res.send(html);
  });
}


/**
 * Return the number of milliseconds from right now
 * when the cache for the given route should expire
 *
 * @param url
 * @returns {number}
 */
function getPageTimeToExpiry(url) {
  // the about page needs to update on my birthday as well as on the
  // the new year to update my age as well as the copyright notice and
  // years of experience referred to in this route
  if (url === '/about') {
    return Math.min(timeToMyBirthday(), timeToNewYear());
  }

  // all pages need to update their cache after the new year in
  // order to update the footer copyright notice and any reference
  // to my years of experience
  return timeToNewYear();
}


/**
 * Return the number of milliseconds from right now
 * until my next birthday
 *
 * @returns {number}
 */
function timeToMyBirthday() {
  const now = moment();

  // if the month is greater than 0 (january) then my birthday is next
  // year. now.month() > 0 is coerced to a number so this works for my
  // use case because my birthday is on the last day of the month.
  const nextBirthday = moment(`${now.year() + (now.month() > 0)}-01-31`);

  return nextBirthday.diff(now);
}


/**
 * Return the number of milliseconds from right now
 * until the next new year
 *
 * @returns {number}
 */
function timeToNewYear() {
  const now = moment();
  const nextNewYear = moment(`${now.year() + 1}-01-01`);
  return nextNewYear.diff(now);
}
