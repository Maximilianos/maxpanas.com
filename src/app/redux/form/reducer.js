import {reducer as formReducer} from 'redux-form';


export default formReducer.plugin({
  contact: resetFieldsOnSuccess
});


/**
 * Reset the form fields when the form submission
 * succeeds, but keep the submission success message
 * visible
 *
 * @param state
 * @param action
 * @returns {{submitSucceeded: boolean}}
 */
function resetFieldsOnSuccess(state, action) {
  return action.type === 'redux-form/SET_SUBMIT_SUCCEEDED'
    ? {submitSucceeded: true}
    : state;
}
