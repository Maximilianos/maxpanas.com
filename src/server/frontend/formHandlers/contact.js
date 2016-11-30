import {initialize, startSubmit, stopSubmit} from 'redux-form';
import {onSubmit, validate} from '../../../app/containers/ContactForm';
import isNonEmptyObject from '../../../utils/isNonEmptyObject';


/**
 * Handle non-JS submission of the contact form from the
 * front-end
 *
 * @param req
 * @param res
 * @param next
 */
export default async function contact(req, res, next) {
  if (!req.store) {
    next(new Error('Contact form submission attempted before store was created'));
    return;
  }

  const form = 'contact';
  const {dispatch} = req.store;

  dispatch(startSubmit(form));

  const errors = validate(req.body);
  if (isNonEmptyObject(errors)) {
    dispatchFailure(errors);
    next();
    return;
  }

  try {
    await onSubmit(req.body, null, null, `${req.protocol}://${req.get('host')}/`);
  } catch (error) {
    dispatchFailure(error.errors);
    next();
    return;
  }

  // if we get here, the form submission has succeeded! :)
  dispatch(stopSubmit(form));
  next();

  /**
   * Notify the store that the form submission failed.
   * Populate the fields with the relevant values and
   * errors
   *
   * @param errors
   */
  function dispatchFailure(errors) {
    dispatch(initialize(form, req.body));
    dispatch(stopSubmit(form, errors));
  }
}
