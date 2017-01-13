import {getArchivePath} from '../github/types/archive';

import createCacheClient from '../../../utils/cache';
import {
  getChangesFromCommits,
  getArchivesFromFileUrls,
  getArticlesFromFileUrls
} from '../../../utils/github';


const cache = createCacheClient({
  name: 'Content API',
  keyPrefix: 'api:content:'
});


/**
 * Save the given object to the cache for the given
 * resource identifier. Making sure to JSON stringify
 * it for the redis cache
 *
 * @param resource
 * @param response
 * @returns {Promise.<void>}
 */
export function putResponseInCache(resource, response) {
  return cache.put(resource, response, {
    asJSONinRedis: true
  });
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
  return cache.get(resource, {
    asJSONinRedis: true
  });
}


/**
 * Remove items from the caches that were affected by the
 * changes made to the articles
 *
 * sends a no-content response because we don't want
 * to be sending any content back to github
 *
 * @param commits
 * @returns {Promise.<*>}
 */
export async function updateCache({commits}) {
  if (!commits || !commits.length) {
    return null;
  }

  const {additions, removals, modifications} = getChangesFromCommits(commits);

  // archives are modified only when articles are added, renamed or removed,
  // so additions and removals are the only lists we care about here
  const modifiedArchives = getArchivesFromFileUrls(additions, removals)
    .map(archive => `${getArchivePath(archive)}:`);

  // articles will be in cache only if they existed and were removed or were
  // modified, so removals and modifications are the only lists we care about
  const modifiedArticles = getArticlesFromFileUrls(removals, modifications);

  if (!modifiedArchives.length && !modifiedArticles.length) {
    return null;
  }

  const changes = modifiedArchives.concat(modifiedArticles);

  return cache.flushWhereKeyContains(changes);
}
