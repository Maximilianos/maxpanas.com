import React, {Component} from 'react';
import {IndexLink, Link} from 'react-router';

const style = {
  reset: {
    margin: 0,
    padding: 0,
    listStyle: 'none',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '0 auto',
    maxWidth: '1024px',
  },
  logo: {
    textTransform: 'uppercase',
    textDecoration: 'none',
    fontFamily: 'Arial Black, sans-serif',
    fontWeight: 900,
    fontSize: '72px',
    lineHeight: 1,
    color: 'tomato',
  },
  navItem: {
    display: 'inline-block',
  },
  navLink: {
    display: 'block',
    color: '#444',
    fontFamily: 'Arial, sans-serif',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    textDecoration: 'none',
    padding: '10px 20px',
  },
};

export default class Header extends Component {
  render() {
    return (
      <header style={style.header}>
        <h1 style={style.reset}>
          <IndexLink to="/" style={style.logo}>
            <abbr title="Max GJ Panas">MAX</abbr>
          </IndexLink>
        </h1>
        <nav>
          <ul style={style.reset}>
            <li style={style.navItem}>
              <Link to="/about" style={style.navLink}>About Me</Link>
            </li>
            <li style={style.navItem}>
              <Link to="/asdasdasdas" style={style.navLink}>404</Link>
            </li>
          </ul>
        </nav>
      </header>
    );
  }
}
