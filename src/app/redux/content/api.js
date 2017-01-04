import {fetchContentIfNeeded} from './actions';
import {CONTENT_API} from '../../config';


/**
 * Return the api endpoint on
 * the local api for the given
 * article
 *
 * @param {string} article
 * @returns {string}
 */
export function getArticlePath(article) {
  return `${CONTENT_API}/articles/${article}`;
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
  return `${CONTENT_API}/archives/${archive}`;
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
  return async response => {
    const archive = await response.json();

    const articles = archive.map(
      article => dispatch(fetchContentIfNeeded(
        getArticlePath(article),
        {responseParser: parseArticle}
      ))
    );

    // only wait for the articles to fully
    // download if we are on the server
    if (!process.env.IS_BROWSER) {
      await Promise.all(articles);
    }

    return archive;
  };
}
