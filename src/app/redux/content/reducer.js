import {
  FETCH_CONTENT_PENDING,
  FETCH_CONTENT_SUCCESS,
  FETCH_CONTENT_FAILURE
} from './actions';


/**
 * Manage how any content related actions
 * affect the state of the application
 *
 * @param state
 * @param type
 * @param contentID
 * @param payload
 * @returns {*}
 */
export default function content(state = {}, {type, contentID, ...payload}) {
  switch (type) {

    case FETCH_CONTENT_PENDING: {
      return {
        ...state,
        [contentID]: {
          error: undefined,
          data: undefined,
          ...state[contentID],
          fetching: true
        }
      };
    }

    case FETCH_CONTENT_SUCCESS: {
      return {
        ...state,
        [contentID]: {
          fetching: false,
          error: undefined,
          data: payload.data
        }
      };
    }

    case FETCH_CONTENT_FAILURE: {
      return {
        ...state,
        [contentID]: {
          fetching: false,
          error: payload.error,
          data: undefined
        }
      };
    }

    default: return state;
  }
}
