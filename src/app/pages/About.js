import React, {Component} from 'react';
import Helmet from 'react-helmet';
import Entry from '../elements/Entry';

export default class About extends Component {
  render() {
    return (
      <Entry title="Hello!">
        <Helmet title="About" />
        <p>
          I am Max GJ Panas, web developer.
        </p>
      </Entry>
    );
  }
}
