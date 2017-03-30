import {actionTypes, reducer} from 'redux-form';


export default reducer.plugin({
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
  return action.type === actionTypes.SET_SUBMIT_SUCCEEDED
    ? {submitSucceeded: true}
    : state;
}
