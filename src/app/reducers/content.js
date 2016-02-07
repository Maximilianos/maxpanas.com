import {
  FETCH_CONTENT_PENDING,
  FETCH_CONTENT_SUCCESS,
  FETCH_CONTENT_FAILURE
} from '../actions/content';


/**
 *
 *
 * @param state
 * @param type
 * @param content
 * @param payload
 * @returns {*}
 */
export default function content(state = {}, {type, content, ...payload}) {
  switch (type) {

    case FETCH_CONTENT_PENDING: return {
      ...state,
      isFetching: content
    };

    case FETCH_CONTENT_SUCCESS: {
      return {
        isFetching: false,
        currentContent: content,
        data: payload.data
      };
    }

    case FETCH_CONTENT_FAILURE: {
      return {
        isFetching: false,
        currentContent: content,
        error: payload.error
      };
    }

    default: return state;
  }
}
