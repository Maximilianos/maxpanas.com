import fetch from 'isomorphic-fetch';

export const FETCH_CONTENT = 'FETCH_CONTENT';
export const FETCH_CONTENT_PENDING = 'FETCH_CONTENT_PENDING';
export const FETCH_CONTENT_SUCCESS = 'FETCH_CONTENT_SUCCESS';
export const FETCH_CONTENT_FAILURE = 'FETCH_CONTENT_FAILURE';

const GITHUB_API = 'https://api.github.com';
const REPOS_API = GITHUB_API + '/repos';
const ARTICLES_REPO = REPOS_API + '/Maximilianos/articles/contents';


/**
 *
 *
 * @param article
 * @param store
 * @returns {{type: string, payload: {promise}}}
 */
export function fetchContent({params: {article}, store}) {
  const {content: {isFetching, currentContent}} = store.getState();
  if (isFetching === article || (currentContent === article && !isFetching)) return {};

  return {
    type: FETCH_CONTENT,
    payload: {
      data: article,
      promise: fetch(`${ARTICLES_REPO}/articles/${article}.md`)
        .then(response => response.json())
        .then(data => ({data, id: article}))
    }
  };
}
