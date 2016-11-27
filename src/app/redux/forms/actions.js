export const FORM_SUBMISSION_START = 'FORM_SUBMISSION_START';
export const FORM_SUBMISSION_SUCCESS = 'FORM_SUBMISSION_SUCCESS';
export const FORM_SUBMISSION_FAILURE = 'FORM_SUBMISSION_FAILURE';

export function submissionStart(form) {
  return {
    type: FORM_SUBMISSION_START,
    form
  };
}

export function submissionSuccess(form) {
  return {
    type: FORM_SUBMISSION_SUCCESS,
    form
  };
}

export function submissionFailure({form, error, details}) {
  return {
    type: FORM_SUBMISSION_FAILURE,
    form, error, details
  };
}

export const FORM_INPUT_VALIDITY = 'FORM_INPUT_VALIDITY';
export const FORM_INPUT_CHANGE = 'FORM_INPUT_CHANGE';
export const FORM_INPUT_FOCUS = 'FORM_INPUT_FOCUS';
export const FORM_INPUT_BLUR = 'FORM_INPUT_BLUR';

export function inputValidity(form, input, valid, validations, error) {
  return {
    type: FORM_INPUT_VALIDITY,
    form, input, valid,
    validations, error
  };
}

export function inputChange(form, input, value) {
  return {
    type: FORM_INPUT_CHANGE,
    form, input, value
  };
}

export function inputFocus(form, input) {
  return {
    type: FORM_INPUT_FOCUS,
    form, input
  };
}

export function inputBlur(form, input) {
  return {
    type: FORM_INPUT_BLUR,
    form, input
  };
}
