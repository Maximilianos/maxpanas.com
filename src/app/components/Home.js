import React from 'react';
import Helmet from 'react-helmet';
import Entry from './Entry';

export default function Home() {
  return (
    <Entry title="Welcome to my Website!">
      <Helmet title="Home" />
    </Entry>
  );
}
