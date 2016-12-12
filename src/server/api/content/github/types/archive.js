import {REPO_CONTENT_API} from '../config';
import {removeFileExtension} from '../utils';
import {fetchArticleData} from './article';


/**
 * Return the api endpoint on
 * github for the given archive
 *
 * @param {string} archive
 * @returns {string}
 */
export function getArchivePath(archive) {
  return `${REPO_CONTENT_API}/${archive}`;
}


/**
 * Parse a response from the
 * GitHub Api into an archive
 * and load the contained
 * articles as well
 *
 * @param {Response} response
 * @returns {Promise}
 */
export function parseArchive(response) {
  return response.json()
    .then(getArchiveArticles)
    .then(fetchArticleData)
    .then(articles => articles
      .filter(({error}) => !error)
      .sort((a, b) => a.published < b.published)
      .map(({slug}) => slug)
    );
}


/**
 * Get a list of contents from
 * a given archive
 *
 * @param {*} archive
 * @returns {Array}
 */
function getArchiveArticles(archive) {
  return archive && archive.length
    ? archive.map(({name}) => removeFileExtension(name))
    : [];
}
