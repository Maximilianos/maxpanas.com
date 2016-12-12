import React, {PropTypes} from 'react';

import {Field} from 'redux-form';
import Form from '../../Form/Form';
import Input from '../../Form/Input/Input';
import BotPot from '../../Form/BotPot/BotPot';
import Submit from '../../Form/Submit/Submit';


ContactForm.propTypes = {
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  submitFailed: PropTypes.bool,
  formMessage: PropTypes.string
};
export default function ContactForm({
  handleSubmit,
  submitting,
  submitFailed,
  formMessage
}) {
  return (
    <Form onSubmit={handleSubmit}>

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

      <BotPot />

      <Submit
        submitting={submitting}
        submitFailed={submitFailed}
        formMessage={formMessage}
      />

    </Form>
  );
}
