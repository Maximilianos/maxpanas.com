import fs from 'fs';
import path from 'path';

import LRU from 'lru-cache';
import {createClient} from 'redis';


import {
  LRU_SIZE,
  REDIS_PATH,
  REDIS_PASSWORD
} from './config';


/**
 * Redis Lua script to delete any entries from cache that
 * contain the given strings in their keys
 *
 * @type string
 */
const flushWhereKeyContainsScript = path.join(
  __dirname,
  'flush-where-key-contains.lua'
);


/**
 * Create a client wrapper and handler to the caching
 * strategy
 *
 * @param name
 * @param keyPrefix
 * @returns {{
 *    get: Function.<Promise.<*>>,
 *    put: Function.<Promise.<*>>,
 *    flushWhereKeyContains: Function.<Promise.<*>>
 * }}
 */
export default function createCacheClient({
  name = '',
  keyPrefix = ''
}) {
  const lru = LRU(LRU_SIZE);
  const redis = createClient(REDIS_PATH, {
    password: REDIS_PASSWORD,
    retry_strategy({attempt}) {
      return attempt > 5
        ? new Error('Redis connection failed too many times, not trying to connect any more')
        : Math.min(attempt * 100, 3000);
    }
  });

  redis.on('error', error => console.log(error.toString()));
  redis.on('connect', () => {
    console.log(`${name && `${name} `}Redis Cache Connected`);

    // flush the cache whenever the server restarts in development
    // mode because it is very likely that code has changed that will
    // affect how pages should be rendered
    if (process.env.NODE_ENV === 'development') {
      console.log(`${name && `${name} `}Redis Cache Flushed for Development`);
      redis.flushall();
    }
  });


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


  return {
    get,
    put,
    flushWhereKeyContains
  };

  /**
   * Get the final cache key for a given resource, taking
   * into account the configured cache keyPrefix
   *
   * @param resource
   * @returns {string}
   */
  function getCacheKey(resource) {
    return `${keyPrefix}${resource}`;
  }


  /**
   * Retrieve an item from the cache, try to retrieve it
   * from the in-memory cache first and if that fails then
   * try to retrieve it from the redis cache
   *
   * Also handle the case that the value needed to be saved
   * in redis as a stringified JSON object
   *
   * @param resource
   * @param asJSONinRedis
   * @returns {Promise.<*>}
   */
  async function get(resource, {asJSONinRedis} = {}) {
    const key = getCacheKey(resource);

    const payload = lru.get(key);
    if (payload) {
      return payload;
    }

    if (!redis.connected) {
      return null;
    }

    return new Promise(resolve => redis.get(key, (error, payload) => {
      if (error) {
        resolve(null);
        return;
      }

      const finalPayload = asJSONinRedis
        ? JSON.parse(payload)
        : payload;

      resolve(finalPayload || null);
    }));
  }


  /**
   * Save a value into both the in-memory cache and the redis
   * cache and if applicable apply an expiry (given in milliseconds)
   * and also if applicable save as a JSON into the redis cache
   *
   * @param resource
   * @param payload
   * @param expiry
   * @param asJSONinRedis
   * @returns {Promise.<void>}
   */
  async function put(resource, payload, {expiry, asJSONinRedis} = {}) {
    const key = getCacheKey(resource);

    lru.set(key, payload, expiry);

    if (!redis.connected) {
      return null;
    }

    const redisPayload = asJSONinRedis
      ? JSON.stringify(payload)
      : payload;

    redis.set(key, redisPayload);
    if (expiry) {
      // redis expiry expects ttl in seconds not milliseconds, so need to
      // convert. Math.ceil is used to make sure the cache is always updated
      // AFTER the expiry date has passed
      redis.expire(key, Math.ceil(expiry / 1000));
    }
  }


  /**
   * Delete items from both the in-memory and the redis cache whose
   * keys contain values contained in the given array of keyWildcards
   *
   * @param keyWildcards
   * @returns {Promise<Promise<T>|Promise>}
   */
  async function flushWhereKeyContains(keyWildcards) {
    // delete the relevant cache entries from the lru cache
    lru.keys()
      .filter(key => keyWildcards.some(item => key.includes(item)))
      .forEach(key => lru.del(key));

    if (!redis.connected) {
      return null;
    }

    // delete the relevant cache entries from redis
    // NOTE: the following script will block the redis server until it has completed.
    //       It will adversely affect the response time of the redis cache server while
    //       the following script is running. As such it should be used with caution.
    // TODO: do I really need atomicity here? Or can I clear the cache without blocking?
    return new Promise(resolve =>
      loadRedisLuaScript(flushWhereKeyContainsScript, (error, hash) => {
        if (error) {
          redis.flushall();
          resolve();
          return;
        }

        redis.evalsha(hash, 0, keyPrefix, ...keyWildcards, error => {
          if (error) redis.flushall();
          resolve();
        });
      })
    );
  }
}
