import React from 'react';
import Helmet from 'react-helmet';
import Entry from './Entry';

export default function About() {
  return (
    <Entry title="Hello!">
      <Helmet title="About" />
      <p>
        I am Max GJ Panas, web developer.
      </p>
    </Entry>
  );
}
