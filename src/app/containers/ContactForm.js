import React, {PropTypes} from 'react';
import {reduxForm, SubmissionError} from 'redux-form';
import isEmail from 'validator/lib/isEmail';
import fetch from 'isomorphic-fetch';

import ContactForm from '../components/Pages/Contact/ContactForm';


const formMessages = {
  success: '✓ Your message was sent! Thank you, I will try to get back to you as soon as possible!',
  error: {
    invalid: 'Please, fill in the form correctly.',
    generic: 'There was a problem submitting your form. Please, try again.'
  }
};


/**
 * Validate the form's data on the client side
 *
 * @param {string} name
 * @param {string} email
 * @param {string} message
 * @param {string} botpot
 * @returns {object}
 */
export function validate({name, email, message, botpot} = {}) {
  const errors = {};

  if (!name) {
    errors.name = 'I need to know who to say hi to';
  }

  if (!email) {
    errors.email = 'I need to know where to send my reply';
  } else if (!isEmail(email)) {
    errors.email = 'Sorry, this isn\'t a valid email';
  }

  if (!message) {
    errors.message = 'Please, tell me what you would like from me';
  }

  if (botpot) {
    errors.botpot = true;
  }

  // display a form-level error if any of the validations above failed
  if (Object.keys(errors).length) {
    errors._error = formMessages.error.invalid; // eslint-disable-line no-underscore-dangle
  }

  return errors;
}


/**
 * Handle the contact form submission on the client side
 *
 * @param {object} values
 * @param {function} dispatch
 * @param {object} props
 * @param {string} urlBase
 */
export async function onSubmit(values, dispatch, props, urlBase = '') {
  let json;

  try {
    const response = await fetch(`${urlBase}api/forms/contact`, {
      method: 'POST',
      headers: new Headers({'Content-Type': 'application/json'}),
      body: JSON.stringify(values)
    });

    json = await response.json();
  } catch (error) {
    throw new SubmissionError({
      _error: formMessages.error.generic
    });
  }

  if (json.success) {
    return;
  }

  const {code, details} = json.error;

  if (code === 'INVALID') {
    throw new SubmissionError({
      ...details,
      _error: formMessages.error.invalid
    });
  }

  throw new SubmissionError({
    _error: formMessages.error.generic
  });
}


FormMessageProvider.propTypes = {
  submitSucceeded: PropTypes.bool,
  submitFailed: PropTypes.bool,
  error: PropTypes.string
};
function FormMessageProvider(props) {
  const {submitSucceeded, submitFailed, error} = props;
  const formMessage = (
    (submitSucceeded && formMessages.success)
    || (submitFailed && error)
    || ''
  );

  return (
    <ContactForm
      {...props}
      formMessage={formMessage}
    />
  );
}


export default reduxForm({
  form: 'contact',
  validate,
  onSubmit
})(FormMessageProvider);
