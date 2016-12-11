import qs from 'querystring';
import parseLinks from 'parse-link-header';

import {Base64} from 'js-base64';
import frontMatter from 'front-matter';
import marked from 'marked';
import hljs from 'highlight.js';

import {fetchContent, ResponseForbiddenError} from './fetchContent';
import {isProduction} from '../../config';

const USER = 'Maximilianos';
const REPO = 'articles';
const ARTICLES_BASE_DIR = 'articles';

const GITHUB_API = 'https://api.github.com';

const USERS_API = `${GITHUB_API}/users`;

const REPOS_API = `${GITHUB_API}/repos`;
const REPO_API = `${REPOS_API}/${USER}/${REPO}`;
const REPO_CONTENT_API = `${REPO_API}/contents`;
const REPO_COMMITS_API = `${REPO_API}/commits`;


/**
 * Return the api endpoint on
 * github for the given article
 *
 * @param {string} article
 * @returns {string}
 */
export function getArticlePath(article) {
  return `${REPO_CONTENT_API}/${ARTICLES_BASE_DIR}/${article}.md`;
}


/**
 * Return the api endpoint on
 * github for the updates to a
 * given article
 *
 * @param article
 * @param perPage
 * @param page
 * @returns {string}
 */
export function getArticleUpdatesPath(article, {perPage = 100, page = 1} = {}) {
  return `${REPO_COMMITS_API}?${qs.stringify({
    path: `/${ARTICLES_BASE_DIR}/${article}.md`,
    per_page: perPage,
    page
  })}`;
}


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
  const {name, content} = await response.json();
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
    contributors: await fetchContributorData(removeExtension(name)),
    body: marked(body, {highlight})
  };
}


/**
 * Fetch contributor data for
 * the given article
 *
 * @param article
 * @returns {*}
 */
async function fetchContributorData(article) {
  const {payload} = await fetchContent(
    getArticleUpdatesPath(article),
    {parser: collatePaginatedContent(parseJson)}
  );

  return payload
    .map(({commit: {author: {name}}, author: {login, avatar_url}}) => ({
      username: login, avatar: avatar_url, name
    }))
    .reduce(aggregateContributions, []);
}


/**
 *
 *
 * @param parser
 * @returns {function}
 */
export function collatePaginatedContent(parser) {
  return async function collater(response) {
    const payload = await parser(response);
    if (!Array.isArray(payload)) {
      throw new TypeError('Error: Payload must be an array in order to be collated');
    }

    const linkHeader = response.headers.get('Link');
    if (!linkHeader) {
      return payload;
    }

    const {next} = parseLinks(linkHeader);
    if (!next) {
      return payload;
    }

    const {payload: nextPayload} = await fetchContent(next.url, {
      parser: collater
    });

    if (nextPayload.error) {
      throw new Error('Error: Collation failed because one of the requests to failed');
    }

    return payload.concat(nextPayload);
  };
}


/**
 *
 *
 * @param response
 * @returns {Promise}
 */
function parseJson(response) {
  return response.json();
}


/**
 *
 *
 * @param agg
 * @param username
 * @param avatar
 * @param name
 * @param contributions
 * @returns {array}
 */
function aggregateContributions(agg, {username, avatar, name, contributions = 1}) {
  const indexOfExisting = agg.findIndex(c => c.username === username);
  if (indexOfExisting >= 0) {
    agg[indexOfExisting] = {
      ...agg[indexOfExisting],
      contributions: agg[indexOfExisting].contributions + contributions
    };

    return agg;
  }

  return agg.concat({
    username, avatar, name,
    contributions,
  });
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
    ? archive.map(({name}) => removeExtension(name))
    : [];
}


/**
 * Simplistic remove extension from
 * file path
 *
 * @param {string} path
 * @returns {string}
 */
function removeExtension(path) {
  return path.slice(0, path.indexOf('.'));
}
