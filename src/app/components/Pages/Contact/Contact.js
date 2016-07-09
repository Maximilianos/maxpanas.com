import React from 'react';
import Helmet from 'react-helmet';

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
      <h1 className="contact__title">
        Let's Talk
      </h1>
      <section className="contact__details">
      </section>
    </main>
  );
}
