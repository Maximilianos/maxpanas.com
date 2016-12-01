import {fetchContentIfNeeded} from './actions';


/**
 * Base url for all content api
 * fetch requests
 *
 * @type {string}
 */
export const API_BASE = '/api/content';


/**
 * Return the api endpoint on
 * the local api for the given
 * article
 *
 * @param {string} article
 * @returns {string}
 */
export function getArticlePath(article) {
  return `${API_BASE}/articles/${article}`;
}


/**
 * Return the api endpoint on
 * the local api for the given
 * archive
 *
 * @param {string} archive
 * @returns {string}
 */
export function getArchivePath(archive) {
  return `${API_BASE}/archives/${archive}`;
}


/**
 * Parse a response from the
 * local api into an article
 *
 * @returns {function}
 */
export function parseArticle() {
  return response => response.json();
}


/**
 * Parse a response from the
 * local api into an archive
 * and load the contained
 * articles as well
 *
 * @param {function} dispatch
 * @returns {function}
 */
export function parseArchive(dispatch) {
  return response => response.json().then(archive => {
    const articles = archive.map(
      article => dispatch(fetchContentIfNeeded(
        getArticlePath(article),
        {responseParser: parseArticle}
      ))
    );

    return Promise.all(articles).then(() => archive);
  });
}
