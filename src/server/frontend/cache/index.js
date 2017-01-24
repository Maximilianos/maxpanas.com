import getPageTimeToExpiry from './expiry';

import createCacheClient from '../../utils/cache';
import {
  getChangesFromCommits,
  getArchivesFromFileUrls,
  getArticlesFromFileUrls
} from '../../utils/github';


const cache = createCacheClient({
  name: 'Frontend',
  keyPrefix: 'frontend:'
});


/**
 * Save the given html into the cache for the
 * given url and set an appropriate expiry time
 * for the given url
 *
 * @param url
 * @param html
 * @returns {Promise.<void>}
 */
function cachePage(url, html) {
  return cache.put(url, html, {
    expiry: getPageTimeToExpiry(url)
  });
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
export async function pageCacheMiddleware({url}, res, next) {
  const html = await cache.get(url);
  if (html) {
    res.send(html);
    return null;
  }

  // replace the res.status method with our own that
  // will save the response to the cache if the status
  // code is a 200 valid response
  const status = res.status;
  res.status = code => {
    const resWithStatus = status.call(res, code);

    // we need to replace the send method on the returned
    // response object to actually cache it after it is sent
    const send = resWithStatus.send;
    resWithStatus.send = html => {
      send.call(resWithStatus, html);
      if (code === 200) {
        cachePage(url, html);
      }
    };

    return resWithStatus;
  };

  next();
}


/**
 * Remove items from the caches that were affected by the
 * changes made to the articles
 *
 * sends a no-content response because we don't want
 * to be sending any content back to github
 *
 * @param commits Array
 * @returns {Promise.<*>}
 */
export async function updateCache({commits}) {
  if (!commits || !commits.length) {
    return null;
  }

  const {additions, removals, modifications} = getChangesFromCommits(commits);

  // rendered archives are modified when articles are added, renamed, removed or
  // modified, so we care about all lists here
  const modifiedArchives = getArchivesFromFileUrls(additions, removals, modifications);

  // rendered articles will be in cache only if they existed and were removed or
  // were modified, so removals and modifications are the only lists we care about
  const modifiedArticles = getArticlesFromFileUrls(removals, modifications);

  if (!modifiedArchives.length && !modifiedArticles.length) {
    return null;
  }

  const changes = modifiedArchives.concat(modifiedArticles);

  // add the homepage to the pages to remove from cache if articles changed
  if (modifiedArchives.includes('articles')) {
    changes.push('/');
  }

  return cache.flushWhereKeyContains(changes);
}
