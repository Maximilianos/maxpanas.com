import React from 'react';

import isEmail from 'validator/lib/isEmail';
import isNotEmpty from '../../../../utils/validator/validators/isNotEmpty';

import Form from '../../../containers/Form';
import Input from '../../../containers/Input';
import Submit from '../../Form/Submit/Submit';


export default function ContactForm() {
  return (
    <Form
      noValidate
      name="contact"
      method="post"
      action="api/forms/contact"
    >
      <Input
        required
        name="name"
        label="Name"
        size="half"
        validators={isNotEmpty}
        errorMessage="I need to know who to say hi to"
      />
      <Input
        required
        name="email"
        type="email"
        label="Email"
        size="half"
        validators={{isNotEmpty, isEmail}}
        errorMessage={({isNotEmpty}) => (
          isNotEmpty
            ? 'Sorry, this isn\'t a valid email'
            : 'I need to know where to send my reply'
        )}
      />
      <Input
        required
        name="message"
        type="textarea"
        label="Message"
        rows="3"
        validators={isNotEmpty}
        errorMessage="Please, tell me what you would like from me"
      />
      <Submit />
    </Form>
  );
}
