import React from 'react';

import isEmail from 'validator/lib/isEmail';
import isNotEmpty from '../../../../utils/validator/validators/isNotEmpty';

import Form from '../../Form/Form';
import Input from '../../Form/Input/Input';
import Submit from '../../Form/Submit/Submit';


export default function ContactForm() {
  return (
    <Form
      noValidate
      method="post"
      action="api/forms/contact"
    >
      {({sending, message, error, submittedOnce}) => (
        <div>

          <Input
            required
            size="half"
            label="Name"
            name="name"
            validate={submittedOnce}
            validators={isNotEmpty}
            errorMessage="I need to know who to say hi to"
          />

          <Input
            required
            size="half"
            type="email"
            label="Email"
            name="email"
            validate={submittedOnce}
            validators={{isNotEmpty, isEmail}}
            errorMessage={({isNotEmpty}) => (
              isNotEmpty
                ? 'Sorry, this isn\'t a valid email'
                : 'I need to know where to send my reply'
            )}
          />

          <Input
            required
            type="textarea"
            label="Message"
            name="message"
            rows="3"
            validate={submittedOnce}
            validators={isNotEmpty}
            errorMessage="Please, tell me what you would like from me"
          />

          <Submit
            error={error}
            sending={sending}
            message={message}
          />

        </div>
      )}
    </Form>
  );
}
