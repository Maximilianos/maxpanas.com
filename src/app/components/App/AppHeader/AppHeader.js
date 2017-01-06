import React from 'react';
import {IndexLink} from 'react-router';

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
            <li key={to} className="app-header__nav-item">
              <IndexLink
                to={to}
                className="app-header__nav-link"
                activeClassName="app-header__nav-link--active"
              >
                {text}
              </IndexLink>
            </li>
          ))}
        </ul>
      </nav>

    </header>
  );
}
