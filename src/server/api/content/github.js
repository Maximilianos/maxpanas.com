import {Base64} from 'js-base64';
import frontMatter from 'front-matter';
import marked from 'marked';
import Prism from 'prismjs';
import 'prismjs/components/prism-markdown';

const GITHUB_API = 'https://api.github.com';
const REPOS_API = `${GITHUB_API}/repos`;

/**
 * Base url for all api fetch
 * requests
 *
 * @type {string}
 */
const API_BASE = `${REPOS_API}/Maximilianos/articles/contents`;


/**
 * Return the api endpoint on
 * github for the given article
 *
 * @param {string} article
 * @returns {string}
 */
export function getArticlePath(article) {
  return `${API_BASE}/articles/${article}.md`;
}


/**
 * Return the api endpoint on
 * github for the given archive
 *
 * @param {string} archive
 * @returns {string}
 */
export function getArchivePath(archive) {
  return `${API_BASE}/${archive}`;
}


/**
 * Parse a response from the
 * GitHub Api into an article
 *
 * @param {Response} response
 * @returns {Promise}
 */
export function parseArticle(response) {
  return response.json()
    .then(json => Base64.decode(json.content))
    .then(file => frontMatter(file))
    .then(({attributes, body}) => ({
      ...attributes,
      body: marked(body, {highlight})
    }));
}


/**
 * Highlight a code block using
 * Prism
 *
 * @param code
 * @param lang
 * @returns {*}
 */
function highlight(code, lang) {
  return Prism.languages.hasOwnProperty(lang)
    ? Prism.highlight(code, Prism.languages[lang])
    : code;
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
    .then(getArchiveContents);
}


/**
 * Get a list of contents from
 * a given archive
 *
 * @param {*} archive
 * @returns {Array}
 */
function getArchiveContents(archive) {
  return archive && archive.length
    ? archive.map(({name}) => name.slice(0, name.lastIndexOf('.')))
    : [];
}
