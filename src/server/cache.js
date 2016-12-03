import redisCache from 'express-redis-cache';

const cache = redisCache();

cache.on('connected', () => console.log('Redis Cache Connected'));
cache.on('error', error => console.log(error));

export default cache;
