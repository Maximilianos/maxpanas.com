import React, {Component} from 'react';
import {IndexLink, Link} from 'react-router';

export default class Header extends Component {
  render() {
    return (
      <header>
        <h1>MaxPanas.com</h1>
        <nav>
          <ul>
            <li><IndexLink to="/">Home</IndexLink></li>
            <li><Link to="/about">About Me</Link></li>
            <li><Link to="/asdasdasdas">404</Link></li>
          </ul>
        </nav>
      </header>
    );
  }
}
