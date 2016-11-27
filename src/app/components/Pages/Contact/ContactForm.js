import React, {PropTypes} from 'react';
import {Field, reduxForm, SubmissionError} from 'redux-form';
import isEmail from 'validator/lib/isEmail';
import fetch from 'isomorphic-fetch';

import Form from '../../Form/Form';
import Input from '../../Form/Input/Input';
import Submit from '../../Form/Submit/Submit';

const action = 'api/forms/contact';
const method = 'post';


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

  if (Object.keys(errors).length) {
    errors._error = 'Please, fill in the form correctly.'; // eslint-disable-line
  }

  return errors;
}


async function onSubmit(values) {
  let json;

  try {
    const response = await fetch(action, {
      method,
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

  const {code, summary, details} = json.error;

  if (code === 'INVALID') {
    throw new SubmissionError({
      ...details,
      _error: 'Please, fill in the form correctly.'
    });
  }

  throw new SubmissionError({
    _error: summary
  });
}


ContactForm.propTypes = {
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  submitSucceeded: PropTypes.bool,
  submitFailed: PropTypes.bool,
  error: PropTypes.string
};
function ContactForm({
  handleSubmit,
  submitting,
  submitSucceeded,
  submitFailed,
  error
}) {
  return (
    <Form
      noValidate
      method={method}
      action={action}
      onSubmit={handleSubmit}
    >

      <Field
        required
        name="name"
        label="Name"
        size="half"
        component={Input}
        showError={submitFailed}
      />

      <Field
        required
        name="email"
        type="email"
        label="Email"
        size="half"
        component={Input}
        showError={submitFailed}
      />

      <Field
        required
        name="message"
        type="textarea"
        label="Message"
        rows="3"
        component={Input}
        showError={submitFailed}
      />

      <Submit
        sending={submitting}
        error={submitFailed}
        message={
          (submitSucceeded && '✓ Your message was sent! Thank you for your message!')
          || (submitFailed && error)
          || ''
        }
      />

    </Form>
  );
}


export default reduxForm({
  form: 'contact',
  validate,
  onSubmit
})(ContactForm);
