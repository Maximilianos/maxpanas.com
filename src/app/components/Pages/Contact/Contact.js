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

      <form onSubmit={event => event.preventDefault()}>
        <input type="text" name="name" />
        <textarea name="message" />
      </form>

    </Entry>
  );
}
