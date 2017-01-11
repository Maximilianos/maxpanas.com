import fs from 'fs';
import path from 'path';

import LRU from 'lru-cache';
import {createClient} from 'redis';

import getPageTimeToExpiry from './expiry';


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
 * Cache key prefix for the frontend items
 *
 * @type {string}
 */
const FRONTEND_CACHE_PREFIX = 'frontend:';


/**
 * Get the page cache key for a given url
 *
 * @param url
 * @returns {string}
 */
function getPageCacheKey(url) {
  return `${FRONTEND_CACHE_PREFIX}${url}`;
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
 * Load the given Lua script into the redis server and return
 * it's sha hash to be used with the redis.evalsha command
 *
 * @param scriptPath
 * @param callback
 */
const loadRedisLuaScript = (() => {
  const loadedScripts = {};

  return (scriptPath, callback) => {
    if (loadedScripts.hasOwnProperty(scriptPath)) {
      callback(null, loadedScripts[scriptPath]);
      return;
    }

    fs.readFile(scriptPath, 'UTF-8', (error, script) => {
      if (error) {
        callback(error);
        return;
      }

      redis.script('load', script, (error, hash) => {
        if (error) {
          callback(error);
          return;
        }

        loadedScripts[scriptPath] = hash;
        callback(null, hash);
      });
    });
  };
})();


/**
 * Remove items from the caches that were affected by the
 * changes made to the articles
 *
 * sends a no-content response because we don't want
 * to be sending any content back to github
 *
 * @param commits
 * @param res
 */
export function updateCache({body: {commits}}, res) {
  if (!commits || !commits.length) {
    res.status(204).send();
    return;
  }

  // extract the valid unique additions, removals and modifications from the push
  const {additions, removals, modifications} = commits.reduce(
    ({additions, removals, modifications}, {added, removed, modified}) => ({
      additions: union(additions, validArchivesOnly(added)),
      removals: union(removals, validArchivesOnly(removed)),
      modifications: union(modifications, validArchivesOnly(modified))
    }), {
      additions: [],
      removals: [],
      modifications: []
    });

  // archives are modified only when articles are added, renamed or removed,
  // so additions and removals are the only lists we care about here
  const modifiedArchives = union(additions, removals, modifications)
    .map(file => path.basename(path.dirname(file)))
    .filter(unique);

  // articles will be in cache only if they existed and were removed or were
  // modified, so removals and modifications are the only lists we care about
  const modifiedArticles = union(removals, modifications)
    .map(file => path.basename(file))
    .filter(unique);

  if (!modifiedArchives.length && !modifiedArticles.length) {
    res.status(204).send();
    return;
  }

  const changes = modifiedArchives.concat(modifiedArticles);

  // add the homepage to the pages to remove from cache if articles changed
  if (modifiedArchives.includes('articles')) {
    changes.push('/');
  }

  // delete the relevant cache entries from the lru cache
  lru.keys()
    .filter(key => changes.some(changedItem => key.includes(changedItem)))
    .forEach(key => lru.del(key));

  // delete the relevant cache entries from redis
  // NOTE: the following script will block the redis server until it has completed.
  //       It will adversely affect the response time of the redis cache server while
  //       the following script is running. As such it should be used with caution.
  // TODO: do I really need atomicity here? Or can I clear the cache without blocking?
  loadRedisLuaScript(path.join(__dirname, 'flush-where-key-contains.lua'), (error, hash) => {
    if (error) {
      redis.flushall();
      res.status(204).send();
      return;
    }

    redis.evalsha(hash, 0, FRONTEND_CACHE_PREFIX, ...changes, error => {
      if (error) redis.flushall();
      res.status(204).send();
    });
  });
}


/**
 * Filter out any file paths to things that are
 * definitely not articles because they are not
 * a valid article root directory
 *
 * @param filesPaths array
 * @returns {Array}
 */
function validArchivesOnly(filesPaths) {
  const validArchives = ['articles/'];
  return filesPaths.filter(filePath => validArchives.some(
    archive => filePath.startsWith(archive)
  ));
}


/**
 * Utility to concat and de-duplicate a list of arrays
 *
 * @param arrays
 * @returns {string|*|Array.<T>|Buffer}
 */
function union(...arrays) {
  return arrays.reduce((union, array) =>
    union.concat(array.filter(
      item => !union.includes(item)
    ))
  );
}


/**
 * Utility predicate for a filtering out duplicates
 * in an existing array
 *
 * @param item
 * @param index
 * @param arr
 * @returns {boolean}
 */
function unique(item, index, arr) {
  return arr.indexOf(item) === index;
}
