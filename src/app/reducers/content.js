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
export default function content(state = {}, {type, payload}) {
  switch (type) {
    case FETCH_CONTENT_PENDING: return {
      ...state,
      pending: true
    };
    case FETCH_CONTENT_SUCCESS:
    case FETCH_CONTENT_FAILURE: return {
      pending: false,
      data: payload
    };
    default: return state;
  }
}
