import React from 'react';
import Helmet from 'react-helmet';

import Form from '../../Form/Form';
import Input from '../../Form/Input/Input';

import isNotEmpty from '../../Form/validators/isNotEmpty';
import isEmail from 'validator/lib/isEmail';

import './Contact.scss';


export default function Contact() {
  return (
    <main className="contact">
      <Helmet
        title="Get in touch"
        meta={[{
          name: 'description',
          content: 'Max Panas is a web developer with six years of experience ' +
          'working mostly on the front-end side of the stack.'
        }]}
      />
      <h1>
        Contact
      </h1>
      <p>
        If you'd like to say hi, I'm <a href="https://twitter.com/mgjp_">
        @mgjp_</a> on Twitter. Of course, you can also shoot me an email
        at <a href="mailto:m@maxpanas.com">m@maxpanas.com</a> or send me
        a message using the form below.
      </p>
      <p>
        I look forward to hearing from you!
      </p>

      <Form
        noValidate
        method="post"
        onSubmit={(event, {validations}) => {
          console.log(validations);
        }}
      >
        {form => (
          <div>

            <Input
              required
              size="half"
              label="Name"
              name="name"
              validate={form.wasSubmitted}
              validators={isNotEmpty}
              errorMessage="I need to know who to say hi to"
            />

            <Input
              required
              size="half"
              type="email"
              label="Email"
              name="email"
              validate={form.wasSubmitted}
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
              validate={form.wasSubmitted}
              validators={isNotEmpty}
              errorMessage="Please, tell me what you would like from me"
            />

            <button className="form__submit">
              Send Message
            </button>

          </div>
        )}
      </Form>

    </main>
  );
}
