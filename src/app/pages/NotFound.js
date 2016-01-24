import React, {Component} from 'react';
import Helmet from 'react-helmet';
import {IndexLink} from 'react-router';
import Entry from '../elements/Entry';

export default class NotFound extends Component {
  render() {
    return (
      <Entry title="404" subtitle="Not Found.">
        <Helmet title="404" />
        <p>
          <IndexLink to="/">Back Home?</IndexLink>
        </p>
      </Entry>
    );
  }
}
