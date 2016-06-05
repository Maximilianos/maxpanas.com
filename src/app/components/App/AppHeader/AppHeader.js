import React from 'react';
import {IndexLink, Link} from 'react-router';

import './AppHeader.scss';

const navLinks = [{
  to: '/',
  text: 'Home'
}, {
  to: '/about',
  text: 'About'
}];

export default function AppHeader() {
  return (
    <header className="app-header">
      <h1 className="app-header__logo">
        <IndexLink to="/" className="app-header__logo-link">
          <abbr title="Max GJ Panas">
            MAX
          </abbr>
        </IndexLink>
      </h1>
      <nav>
        <ul>
          {navLinks.map(({to, text}) => (
            <li key={to} className="app-header__nav-item">
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
