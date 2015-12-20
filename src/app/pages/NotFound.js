import React, {Component} from 'react';
import {IndexLink} from 'react-router';
import Entry from '../elements/Entry';

export default class NotFound extends Component {
  render() {
    return (
      <Entry title="404" subtitle="Not Found.">
        <p>
          <IndexLink to="/">Back Home?</IndexLink>
        </p>
      </Entry>
    );
  }
}
