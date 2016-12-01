/**
 * Parse a response from the
 * local api
 *
 * @returns {function}
 */
export function parseJSON() {
  return response => response.json();
}


/**
 * Return the api endpoint on
 * the local api for the given
 * article
 *
 * @param {string} article
 * @returns {string}
 */
export function getArticlePath(article) {
  return `/articles/${article}`;
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
  return `/archives/${archive}`;
}
