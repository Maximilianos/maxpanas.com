import {
  FETCH_CONTENT_PENDING,
  FETCH_CONTENT_SUCCESS,
  FETCH_CONTENT_FAILURE
} from '../actions/content';


const initialState = {
  isFetching: false,
  currentContent: false,
  error: false,
  data: false
};


/**
 * Manage how any content related actions
 * affect the state of the application
 *
 * @param state
 * @param type
 * @param content
 * @param payload
 * @returns {*}
 */
export default function content(state = initialState, {type, content, ...payload}) {
  switch (type) {

    case FETCH_CONTENT_PENDING: return {
      ...state,
      isFetching: content
    };

    case FETCH_CONTENT_SUCCESS: {
      return {
        isFetching: false,
        currentContent: content,
        error: false,
        data: payload.data
      };
    }

    case FETCH_CONTENT_FAILURE: {
      return {
        isFetching: false,
        currentContent: content,
        error: payload.error,
        data: false
      };
    }

    default: return state;
  }
}
