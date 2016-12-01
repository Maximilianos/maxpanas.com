import fetch from 'isomorphic-fetch';

export const FETCH_CONTENT_PENDING = 'FETCH_CONTENT_PENDING';
export const FETCH_CONTENT_SUCCESS = 'FETCH_CONTENT_SUCCESS';
export const FETCH_CONTENT_FAILURE = 'FETCH_CONTENT_FAILURE';


/**
 * Notify state that a content
 * request is pending
 *
 * @param {string} contentID
 * @returns {{type: string, contentID: string}}
 */
function requestPending(contentID) {
  return {
    type: FETCH_CONTENT_PENDING,
    contentID
  };
}


/**
 * Update state with the data
 * received from a content
 * request
 *
 * @param {string} contentID
 * @param {*} data
 * @returns {{type: string, contentID: string, data: *}}
 */
function requestSuccess(contentID, data) {
  return {
    type: FETCH_CONTENT_SUCCESS,
    contentID,
    data
  };
}


/**
 * Update state with the error
 * received from a content
 * request
 *
 * @param {string} contentID
 * @param {number} code
 * @param {string} message
 * @returns {{type: string, contentID: string, error: {code: number, message: string}}}
 */
function requestFailure(contentID, code, message) {
  return {
    type: FETCH_CONTENT_FAILURE,
    contentID,
    error: {
      code,
      message
    }
  };
}


/**
 * Catch any api response with non-success
 * status codes and force throw them as
 * errors. Useful in fetch promise chains
 *
 * @param {object} response
 * @returns {object}
 */
function validateResponse(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);

  error.code = response.status;
  error.message = response.statusText;

  throw error;
}


/**
 * Handle fetching and parsing the
 * requested content and dispatching
 * actions to update the state
 * accordingly
 *
 * @param {string} contentID
 * @param {function} responseParser
 * @returns {function}
 */
function fetchContent(contentID, {responseParser}) {
  return (dispatch, getState) => {
    dispatch(requestPending(contentID));

    const parseResponse = (
      typeof responseParser === 'function'
      && responseParser(dispatch, getState)
    );

    return fetch(contentID)
      .then(validateResponse)
      .then(parseResponse)
      .then(dispatchSuccess)
      .catch(dispatchFailure);

    function dispatchSuccess(data) {
      return dispatch(requestSuccess(contentID, data));
    }

    function dispatchFailure({code = 500, message = 'Something went wrong'}) {
      return dispatch(requestFailure(contentID, code, message));
    }
  };
}


/**
 * Check whether the content has already
 * been fetched and cached or is in the
 * process of being fetched and cached
 *
 * @param {object} content
 * @param {string} contentID
 * @returns {boolean}
 */
function shouldFetchContent({content}, contentID) {
  return typeof content[contentID] === 'undefined' || (
    content[contentID].fetching === false
    && content[contentID].error !== undefined
  );
}


/**
 * Fetch the requested content only if
 * it has not already been fetched
 *
 * @param {string} contentID
 * @param {function} responseParser
 * @returns {function}
 */
export function fetchContentIfNeeded(contentID, {responseParser} = {}) {
  return (dispatch, getState) => {
    if (shouldFetchContent(getState(), contentID)) {
      return dispatch(fetchContent(contentID, {responseParser}));
    }
  };
}
