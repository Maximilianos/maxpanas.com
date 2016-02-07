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
 * @param payload
 * @returns {*}
 */
export default function content(state = {}, {type, payload, meta}) {
  switch (type) {

    case FETCH_CONTENT_PENDING: return {
      ...state,
      isFetching: payload
    };

    case FETCH_CONTENT_SUCCESS:
    case FETCH_CONTENT_FAILURE: {
      return {
        ...state,
        isFetching: false,
        currentContent: meta.content,
        data: payload
      };
    }

    default: return state;
  }
}
