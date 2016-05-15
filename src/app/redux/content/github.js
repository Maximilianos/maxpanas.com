import marked from 'marked';
import frontMatter from 'front-matter';
import {Base64} from 'js-base64';

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
 * Parse a response from the
 * GitHub Api
 *
 * @param response
 * @returns {Promise.<Array>|*}
 */
export function parseGitHubResponse(response) {
  return response.json();
}


/**
 * Parse a response from the
 * GitHub Api into an article
 *
 * @param response
 * @returns {Promise.<{body}>}
 */
export function parseArticle(response) {
  return parseGitHubResponse(response)
    .then(json => Base64.decode(json.content))
    .then(file => frontMatter(file))
    .then(({attributes, body}) => ({...attributes, body: marked(body)}));
}
