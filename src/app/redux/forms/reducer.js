import {
  FORM_SUBMISSION_START,
  FORM_SUBMISSION_SUCCESS,
  FORM_SUBMISSION_FAILURE,
  FORM_INPUT_VALIDITY,
  FORM_INPUT_CHANGE,
  FORM_INPUT_FOCUS,
  FORM_INPUT_BLUR
} from './actions';


export function getForm(state = {}, form) {
  return (state.forms && state.forms[form]) || {};
}


export function getInput(state = {}, form, input) {
  const formState = getForm(state, form);
  return (formState.inputs && formState.inputs[input]) || {};
}


/**
 *
 *
 * @param state
 * @param action
 * @returns {{}}
 */
export default function forms(state = {}, action) {
  switch (action.type) {
    case FORM_SUBMISSION_START:
    case FORM_SUBMISSION_SUCCESS:
    case FORM_SUBMISSION_FAILURE:
    case FORM_INPUT_VALIDITY:
    case FORM_INPUT_CHANGE:
    case FORM_INPUT_FOCUS:
    case FORM_INPUT_BLUR: {
      return {
        ...state,
        [action.form]: form(state[action.form], action)
      };
    }

    default:
      return state;
  }
}


/**
 *
 *
 * @param state
 * @param action
 * @returns {*}
 */
function form(state = {}, action) {
  const {type} = action;
  switch (type) {
    case FORM_SUBMISSION_START: {
      return {
        ...state,
        submission: {
          pending: true
        }
      };
    }

    case FORM_SUBMISSION_SUCCESS: {
      return {
        ...state,
        inputs: inputs(state.inputs, action),
        submission: {
          pending: false,
          success: true
        }
      };
    }

    case FORM_SUBMISSION_FAILURE: {
      return {
        ...state,
        submission: {
          pending: false,
          success: false,
          error: {
            id: action.error,
            details: action.details
          }
        }
      };
    }

    case FORM_INPUT_VALIDITY:
    case FORM_INPUT_CHANGE: {
      return {
        ...state,
        inputs: inputs(state.inputs, action)
      };
    }

    case FORM_INPUT_FOCUS:
    case FORM_INPUT_BLUR: {
      return {
        ...state,
        focused: type === FORM_INPUT_FOCUS,
        inputs: inputs(state.inputs, action)
      };
    }

    default:
      return state;
  }
}


/**
 *
 *
 * @param state
 * @param type
 * @param input
 * @param payload
 * @returns {{}}
 */
function inputs(state = {}, {type, input, ...payload}) {
  switch (type) {
    case FORM_SUBMISSION_SUCCESS: {
      return Object.keys(state).reduce((newState, inputName) => ({
        ...newState,
        [inputName]: {
          focused: state[inputName].focused
        }
      }), {});
    }

    case FORM_INPUT_VALIDITY: {
      return {
        ...state,
        [input]: {
          ...state[input],
          valid: payload.valid,
          validations: payload.validations
        }
      };
    }

    case FORM_INPUT_CHANGE: {
      return {
        ...state,
        [input]: {
          ...state[input],
          value: payload.value
        }
      };
    }

    case FORM_INPUT_FOCUS:
    case FORM_INPUT_BLUR: {
      return {
        ...state,
        [input]: {
          ...state[input],
          focused: type === FORM_INPUT_FOCUS
        }
      };
    }

    default:
      return state;
  }
}
