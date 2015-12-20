import React, {Component} from 'react';
import {IndexLink, Link} from 'react-router';

const style = {
  logo: {
    textTransform: 'uppercase',
    textDecoration: 'none',
    fontFamily: 'Arial Black, sans-serif',
    fontWeight: 900,
    fontSize: '72px',
    color: 'tomato',
  },
};

export default class Header extends Component {
  render() {
    return (
      <header>
        <h1>
          <IndexLink to="/" style={style.logo}>
            <abbr title="Max GJ Panas">MAX</abbr>
          </IndexLink>
        </h1>
        <nav>
          <ul>
            <li><Link to="/about">About Me</Link></li>
            <li><Link to="/asdasdasdas">404</Link></li>
          </ul>
        </nav>
      </header>
    );
  }
}
