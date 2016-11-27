import React from 'react';
import {IndexLink, Link} from 'react-router';

import Max from '../../Logo/Max';

import './AppHeader.scss';

const navLinks = [{
  to: '/',
  text: 'Home'
}, {
  to: '/about',
  text: 'About'
}, {
  to: '/contact',
  text: 'Contact'
}];


export default function AppHeader() {
  return (
    <header className="app-header">

      {/* Logo */}
      <h1 className="app-header__logo">
        <IndexLink to="/" className="app-header__logo-link">
          <abbr title="Max GJ Panas">
            <Max dot />
          </abbr>
        </IndexLink>
      </h1>

      {/* Primary Navigation */}
      <nav className="app-header__nav">
        <ul className="app-header__nav-list">
          {navLinks.map(({to, text}) => (
            <li key={to}>
              <Link to={to} className="app-header__nav-link">
                {text}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

    </header>
  );
}
