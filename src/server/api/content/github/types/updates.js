import qs from 'querystring';

import {ARTICLES_BASE_DIR, REPO_COMMITS_API} from '../config';

import {fetchContentCached} from '../../fetchContent';
import {formatDate, collatePaginatedContent} from '../utils';


/**
 * Extract the latest update data from the list
 * of all updates
 *
 * @param allUpdates
 * @returns {*}
 */
export function getLatestUpdateData(allUpdates) {
  const {
    commit: {author: {name, date}, message},
    author: {login, avatar_url}
  } = allUpdates[0];

  return {
    date: formatDate(date),
    message,
    author: {
      username: login,
      avatar: avatar_url,
      name
    }
  };
}


/**
 * Fetch and collect the entire list of updates
 * for a given article
 *
 * @param article
 * @returns {*}
 */
export async function fetchUpdatesData(article) {
  const response = await fetchContentCached(
    getArticleUpdatesPath(article),
    {parser: collatePaginatedContent(parseUpdates)}
  );

  return response.payload;
}


/**
 * Return the api endpoint on github for the
 * updates to a given article
 *
 * @param article
 * @param perPage
 * @param page
 * @returns {string}
 */
function getArticleUpdatesPath(article, {perPage = 100, page = 1} = {}) {
  return `${REPO_COMMITS_API}?${qs.stringify({
    path: `/${ARTICLES_BASE_DIR}/${article}.md`,
    per_page: perPage,
    page
  })}`;
}


/**
 * Parse the github api response for the
 * updates list endpoint
 *
 * @param response
 * @returns {Promise}
 */
function parseUpdates(response) {
  return response.json();
}
