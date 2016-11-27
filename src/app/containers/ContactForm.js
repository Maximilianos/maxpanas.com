import React, {PropTypes} from 'react';
import {reduxForm, SubmissionError} from 'redux-form';
import isEmail from 'validator/lib/isEmail';
import fetch from 'isomorphic-fetch';

import ContactForm from '../components/Pages/Contact/ContactForm';


/**
 * Validate the form's data on the client side
 *
 * @param {string} name
 * @param {string} email
 * @param {string} message
 * @returns {object}
 */
function validate({name, email, message}) {
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

  // display a form-level error if any of the validations above failed
  if (Object.keys(errors).length) {
    errors._error = 'Please, fill in the form correctly.'; // eslint-disable-line
  }

  return errors;
}


/**
 * Handle the contact form submission on the client side
 *
 * @param {object} values
 */
async function onSubmit(values) {
  let json;

  try {
    const response = await fetch('api/forms/contact', {
      method: 'POST',
      headers: new Headers({'Content-Type': 'application/json'}),
      body: JSON.stringify(values)
    });

    json = await response.json();

  } catch (error) {
    throw new SubmissionError({
      _error: 'There was a problem submitting your form. Please, try again.'
    });
  }

  if (json.success) {
    return;
  }

  const {code, details} = json.error;

  if (code === 'INVALID') {
    throw new SubmissionError({
      ...details,
      _error: 'Please, fill in the form correctly.'
    });
  }

  throw new SubmissionError({
    _error: 'There was a problem submitting your form. Please, try again.'
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
    (submitSucceeded && '✓ Your message was sent! Thank you for your message!')
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
