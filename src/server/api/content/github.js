import {Base64} from 'js-base64';
import frontMatter from 'front-matter';
import marked from 'marked';
import hljs from 'highlight.js';

import {fetchContent, ResponseForbiddenError} from './fetchContent';
import {isProduction} from '../../config';

const GITHUB_API = 'https://api.github.com';
const REPOS_API = `${GITHUB_API}/repos`;
const USERS_API = `${GITHUB_API}/users`;

/**
 * Base url for all api fetch
 * requests
 *
 * @type {string}
 */
const REPO_API_BASE = `${REPOS_API}/Maximilianos/articles/contents`;


/**
 * Return the api endpoint on
 * github for the given article
 *
 * @param {string} article
 * @returns {string}
 */
export function getArticlePath(article) {
  return `${REPO_API_BASE}/articles/${article}.md`;
}


/**
 * Return the api endpoint on
 * github for the given archive
 *
 * @param {string} archive
 * @returns {string}
 */
export function getArchivePath(archive) {
  return `${REPO_API_BASE}/${archive}`;
}


/**
 * Return the api endpoint on
 * github for the given user
 *
 * @param username
 * @returns {string}
 */
function getAuthorPath(username) {
  return `${USERS_API}/${username}`;
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
  const {
    attributes: {
      author,
      authors,
      ...attributes
    },
    body
  } = frontMatter(file);

  if (isProduction && attributes.status !== 'published') {
    throw new ResponseForbiddenError();
  }

  const authorUsernames = parseAuthors({author, authors});

  return {
    ...attributes,
    authors: await fetchAuthorData(authorUsernames),
    body: marked(body, {highlight})
  };
}


/**
 * Parse a response from the
 * GitHub Api into an author
 *
 * @param response
 * @returns {{username, avatar_url, name}}
 */
async function parseAuthor(response) {
  const {login, avatar_url, name} = await response.json();
  return {
    username: login,
    avatar: avatar_url,
    name
  };
}


/**
 * Fetch author data for all given
 * usernames
 *
 * @param usernames
 * @returns {*}
 */
async function fetchAuthorData(usernames) {
  const requests = usernames.map(username => fetchContent(
    getAuthorPath(username),
    {parser: parseAuthor})
  );

  const data = await Promise.all(requests);
  return data.map(({payload}) => payload);
}


/**
 * Merge and de-duplicate the author and authors
 * properties into a single array of authors
 *
 * @param author
 * @param authors
 * @returns {[*]}
 */
function parseAuthors({author, authors}) {
  const authorArr = wordsArray(author);
  const authorsArr = wordsArray(authors);

  // return a de-duped concatenation of the two arrays
  return [...new Set([...authorArr, ...authorsArr])];
}


/**
 * Get an array of words from the given
 * string or array
 *
 * @param words
 * @returns {Array}
 */
function wordsArray(words) {
  try {
    const array = Array.isArray(words)
      ? words : words.split(/\s*,\s*|\s+/);
    return array.map(str => str.trim());
  } catch (error) {
    return [];
  }
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
    ? archive.map(({name}) => name.slice(0, name.indexOf('.')))
    : [];
}
