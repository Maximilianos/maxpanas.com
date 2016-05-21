import React from 'react';
import {IndexLink, Link} from 'react-router';

import './AppHeader.scss';

const nav = [{
  to: '/about',
  text: 'Pages Me'
}, {
  to: '/test-1',
  text: 'Article'
}, {
  to: '/non-existent-page',
  text: '404'
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
          {nav.map(({to, text}) => (
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
