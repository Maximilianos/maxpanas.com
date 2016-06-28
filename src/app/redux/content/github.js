import marked from 'marked';
import frontMatter from 'front-matter';
import {Base64} from 'js-base64';

import {fetchContentIfNeeded} from './actions';

const GITHUB_API = 'https://api.github.com';
const REPOS_API = `${GITHUB_API}/repos`;

/**
 * Base url for all api fetch
 * requests
 *
 * @type {string}
 */
export const API_BASE = `${REPOS_API}/Maximilianos/articles/contents`;


/**
 * Return the api endpoint on
 * github for the given article
 *
 * @param article
 * @returns {string}
 */
export function getArticlePath(article) {
  return `${API_BASE}/articles/${article}.md`;
}


/**
 * Return the api endpoint on
 * github for the given archive
 *
 * @param archive
 * @returns {string}
 */
export function getArchivePath(archive) {
  return `${API_BASE}/${archive}`;
}


/**
 * Get a list of contents from
 * a given archive
 *
 * @param archive
 * @returns {Array}
 */
export function getArchiveContents(archive) {
  return archive && archive.length
    ? archive.map(({name}) => name.slice(0, name.lastIndexOf('.')))
    : [];
}


/**
 * Parse a response from the
 * GitHub Api
 *
 * @returns {Function}
 */
export function parseGitHubResponse(response) {
  return response.json();
}


/**
 * Parse a response from the
 * GitHub Api into an article
 *
 * @returns {Function}
 */
export function parseArticle() {
  return response => parseGitHubResponse(response)
    .then(json => Base64.decode(json.content))
    .then(file => frontMatter(file))
    .then(({attributes, body}) => ({...attributes, body: marked(body)}));
}


/**
 * Parse a response from the
 * GitHub Api into an archive
 *
 * @param dispatch
 * @returns {Function}
 */
export function parseArchive(dispatch) {
  return response => parseGitHubResponse(response)
    .then(archive => {

      const archiveContents = getArchiveContents(archive);

      const articles = archiveContents.map(
        article => dispatch(fetchContentIfNeeded(
          getArticlePath(article),
          {responseParser: parseArticle}
        ))
      );

      return Promise.all(articles)
        .then(() => archiveContents);
    });
}
