import fetch from 'isomorphic-fetch';

export const FETCH_CONTENT_PENDING = 'FETCH_CONTENT_PENDING';
export const FETCH_CONTENT_SUCCESS = 'FETCH_CONTENT_SUCCESS';
export const FETCH_CONTENT_FAILURE = 'FETCH_CONTENT_FAILURE';

const GITHUB_API = 'https://api.github.com';
const REPOS_API = GITHUB_API + '/repos';
const ARTICLES_REPO = REPOS_API + '/Maximilianos/articles/contents';


/**
 * Notify state that a content
 * request is pending
 *
 * @param content
 * @returns {{type: string, content: *}}
 */
function requestPending(content) {
  return {
    type: FETCH_CONTENT_PENDING,
    content
  };
}


/**
 * Update state with the data
 * received from a content
 * request
 *
 * @param content
 * @param data
 * @returns {{type: string, content: *, data: *}}
 */
function requestSuccess(content, data) {
  return {
    type: FETCH_CONTENT_SUCCESS,
    content,
    data
  };
}


/**
 * Update state with the error
 * received from a content
 * request
 *
 * @param content
 * @param error
 * @returns {{type: string, content: *, error: *}}
 */
function requestFailure(content, error) {
  return {
    type: FETCH_CONTENT_FAILURE,
    content,
    error
  };
}


/**
 * Handle fetching the requested content
 * and dispatching actions to update
 * the state accordingly
 *
 * @param content
 * @returns {Function}
 */
export function fetchContent(content) {
  return dispatch => {
    dispatch(requestPending(content));

    return fetch(`${ARTICLES_REPO}/articles/${content}.md`)
      .then(response => response.json())
      .then(json => dispatch(requestSuccess(content, json)))
      .catch(error => dispatch(requestFailure(content, error)));
  };
}


/**
 * Check whether the content has already
 * been fetched and cached or is in the
 * process of being fetched and cached
 *
 * @param isFetching
 * @param currentContent
 * @param content
 * @returns {boolean}
 */
function shouldFetchContent({content: {isFetching, currentContent}}, content) {
  return currentContent !== content && isFetching !== content;
}


/**
 * Fetch the requested content only if
 * it has not already been fetched
 * and cached
 *
 * @param content
 * @returns {Function}
 */
export function fetchContentIfNeeded({params: {content}}) {
  return (dispatch, getState) => {
    if (shouldFetchContent(getState(), content)) {
      return dispatch(fetchContent(content));
    }

    return Promise.resolve();
  };
}
