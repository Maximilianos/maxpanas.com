import React from 'react';
import Helmet from 'react-helmet';

import Input from '../../Form/Input';

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
      <form method="post">
        <Input
          size="half"
          label="Name"
          name="name"
        />
        <Input
          size="half"
          type="email"
          label="Email"
          name="email"
        />
        <Input
          type="textarea"
          label="Message"
          name="message"
        />
        <button>
          Send Message
        </button>

      </form>
    </main>
  );
}
