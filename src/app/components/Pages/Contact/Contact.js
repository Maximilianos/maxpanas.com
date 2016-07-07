import React from 'react';
import Helmet from 'react-helmet';

import Entry from '../../Entry/Entry';

import './Contact.scss';

export default function Contact() {
  return (
    <Entry title="Go ahead, ask me anything">
      <Helmet
        title="Contact"
        meta={[{
          name: 'description',
          content: 'Get in touch'
        }]}
      />

      <form
        method="post"
        action={`localhost:8000/contact/?referer=${encodeURIComponent(' ')}`}
        onSubmit={event => {
          event.preventDefault();


        }}
      >
        <p>
          <label htmlFor="contact-name">Name</label>
          <br />
          <input type="text" id="contact-name" name="name" />
        </p>
        <p>
          <label htmlFor="contact-message">Message</label>
          <br />
          <textarea id="contact-message" name="message" />
        </p>
      </form>

    </Entry>
  );
}
