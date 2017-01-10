import fs from 'fs';
import path from 'path';
import LRU from 'lru-cache';
import {createClient} from 'redis';
import {getArchivePath} from '../github/types/archive';

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
 * Cache key prefix for the content API items
 *
 * @type {string}
 */
const CONTENT_API_CACHE_PREFIX = 'api:content:';


/**
 * Get the content API cache key for the given resource
 *
 * @param resource
 * @returns {string}
 */
function getContentAPICacheKey(resource) {
  return `${CONTENT_API_CACHE_PREFIX}${resource}`;
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
  const modifiedArchives = union(additions, removals)
    .map(file => path.basename(path.dirname(file)))
    .filter(unique)
    .map(archive => `${getArchivePath(archive)}:`);

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

    redis.evalsha(hash, 0, CONTENT_API_CACHE_PREFIX, ...changes, error => {
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
 * Utility to concat and de-duplicate two arrays
 *
 * @param arr1
 * @param arr2
 * @returns {string|*|Array.<T>|Buffer}
 */
function union(arr1, arr2) {
  return arr1.concat(arr2.filter(
    item => !arr1.includes(item)
  ));
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
