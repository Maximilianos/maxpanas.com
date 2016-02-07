import fetch from 'isomorphic-fetch';

export const FETCH_CONTENT = 'FETCH_CONTENT';
export const FETCH_CONTENT_PENDING = 'FETCH_CONTENT_PENDING';
export const FETCH_CONTENT_SUCCESS = 'FETCH_CONTENT_SUCCESS';
export const FETCH_CONTENT_FAILURE = 'FETCH_CONTENT_FAILURE';

const GITHUB_API = 'https://api.github.com';
const REPOS_API = GITHUB_API + '/repos';
const ARTICLES_REPO = REPOS_API + '/Maximilianos/articles/contents';


function shouldFetchContent({content: {isFetching, currentContent}}, content) {
  return currentContent !== content && isFetching !== content;
}


function requestPending(content) {
  return {
    type: FETCH_CONTENT_PENDING,
    payload: content
  };
}

function requestSuccess(content, data) {
  return {
    type: FETCH_CONTENT_SUCCESS,
    payload: data,
    meta: {content}
  };
}

function requestFailure(content, err) {
  return {
    type: FETCH_CONTENT_FAILURE,
    payload: err,
    meta: {content}
  };
}


export function fetchContent(content) {
  return dispatch => {
    dispatch(requestPending(content));
    return fetch(`${ARTICLES_REPO}/articles/${content}.md`)
      .then(response => response.json())
      .then(json => dispatch(requestSuccess(content, json)))
      .catch(err => dispatch(requestFailure(content, err)));
  };
}


export function fetchContentIfNeeded({params: {content}}) {
  return (dispatch, getState) => {
    if (shouldFetchContent(getState(), content)) {
      return dispatch(fetchContent(content));
    }

    return Promise.resolve();
  };
}
