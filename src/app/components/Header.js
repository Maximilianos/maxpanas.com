import React from 'react';
import {IndexLink, Link} from 'react-router';

import './Header.scss';

const nav = [{
  to: '/about',
  text: 'About Me'
}, {
  to: '/test-1',
  text: 'Article'
}, {
  to: '/non-existent-page',
  text: '404'
}];

export default function Header() {
  return (
    <header className="header">
      <h1 className="header__logo">
        <IndexLink to="/" className="header__logo-link">
          <abbr title="Max GJ Panas">
            MAX
          </abbr>
        </IndexLink>
      </h1>
      <nav>
        <ul>
          {nav.map(({to, text}) => (
            <li key={to} className="header__nav-item">
              <Link to={to} className="header__nav-link">
                {text}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
