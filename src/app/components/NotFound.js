import React, {Component} from 'react';
import {IndexLink} from 'react-router';

export default class NotFound extends Component {
  render() {
    return (
      <div>
        <h1>404</h1>
        <h2>Not Found.</h2>
        <p>
          <IndexLink to="/">Back Home</IndexLink>
        </p>
      </div>
    );
  }
}
