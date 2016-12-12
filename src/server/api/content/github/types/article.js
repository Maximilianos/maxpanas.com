import {Base64} from 'js-base64';
import frontMatter from 'front-matter';
import marked from 'marked';
import hljs from 'highlight.js';

import {isProduction} from '../../../../config';
import {ARTICLES_BASE_DIR, REPO_CONTENT_API} from '../config';

import {ResponseForbiddenError} from '../../fetchContent';
import {removeFileExtension} from '../utils';
import {fetchUserData} from './user';
import {parseAuthors} from './user/author';
import {getContributorData} from './user/contributor';
import {fetchUpdatesData, getLatestUpdateData} from './updates';


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
 * Parse a response from the
 * GitHub Api into an article
 *
 * TODO: use raw media type accept header and remove the base64 decoding step
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

  // dispatch requests for author data
  const authorUsernames = parseAuthors({author, authors});
  const authorsData = fetchUserData(authorUsernames);

  // dispatch requests for latest update and contributor data
  const article = removeFileExtension(name);
  const allUpdates = await fetchUpdatesData(article);

  return {
    ...attributes,
    authors: await authorsData,
    contributors: getContributorData(allUpdates),
    latestUpdate: getLatestUpdateData(allUpdates),
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
