import redisCache from 'express-redis-cache';
import {isProduction} from './config';

// TODO: Enable intelligent cache invalidation so that cache can
//       be enabled in dev mode as well

let cache = { // eslint-disable-line import/no-mutable-exports
  route: () => (req, res, next) => next()
};

// TODO: Cache does not cache response codes... must fix
if (false) {
  cache = redisCache();
  cache.on('connected', () => console.log('Redis Cache Connected'));
  cache.on('error', error => console.log(error));
}

export default cache;
