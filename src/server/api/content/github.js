import {Base64} from 'js-base64';
import frontMatter from 'front-matter';
import marked from 'marked';
import hljs from 'highlight.js';

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
 * @returns {{}}
 */
export async function parseArticle(response) {
  const {content} = await response.json();
  const file = Base64.decode(content);
  const {attributes, body} = frontMatter(file);
  return {
    ...attributes,
    body: marked(body, {highlight})
  };
}


/**
 * Highlight a code block using
 * HighlightJS
 *
 * @param code
 * @param lang
 * @returns {*}
 */
function highlight(code, lang) {
  let html = code;

  try {
    if (lang === undefined) {
      const {value} = hljs.highlightAuto(code);
      html = value;
    } else if (hljs.getLanguage(lang)) {
      const {value} = hljs.highlight(lang, code);
      html = value;
    }
  } catch (error) {
    console.error(error);
  }

  return html;
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
