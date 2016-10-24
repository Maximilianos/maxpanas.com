import React, {Component} from 'react';
import fetch from 'isomorphic-fetch';

import isEmail from 'validator/lib/isEmail';
import isNotEmpty from '../../../../utils/validator/validators/isNotEmpty';

import Form from '../../Form/Form';
import Input from '../../Form/Input/Input';
import Submit from '../../Form/Submit/Submit';


export default class ContactForm extends Component {
  constructor() {
    super();

    this.state = {
      submittedOnce: false,
      sending: false,
      error: false,
      message: ''
    };
  }

  // TODO: clean this function up. Maybe do all this in Form?
  onSubmit = async (event, {inputs, getFormState}) => {
    event.preventDefault();
    this.setState({
      submittedOnce: true,
      sending: true,
      error: false,
      message: ''
    });

    try {
      const {valid, elements} = await getFormState();

      if (!valid) {
        this.setState({
          sending: false,
          error: true,
          message: 'Please, correctly fill in the form.'
        });
        return;
      }

      const formData = Object.entries(elements)
        .reduce((data, [field, {value}]) => ({...data, [field]: value}), {});

      const response = await fetch('api/forms/contact', {
        method: 'POST',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify(formData)
      });

      const json = await response.json();

      if (json.success && !json.error) {

        // TODO: figure out a declarative way of doing this.
        inputs.forEach(input => input.reset());

        this.setState({
          sending: false,
          message: '✓ Your message was sent! Thank you for your message!'
        });
      } else {
        this.setState({
          sending: false,
          error: true,
          message: json.error.summary
        });
      }
    } catch (error) {
      this.setState({
        sending: false,
        error: true,
        message: 'There was a problem submitting your form. Please, try again.'
      });
    }
  };

  render() {
    const {sending, message, error, submittedOnce} = this.state;
    return (
      <Form
        noValidate
        method="post"
        action="api/forms/contact"
        onSubmit={this.onSubmit}
      >
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

      </Form>
    );
  }
}
