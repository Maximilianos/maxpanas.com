import React, {Component} from 'react';
import {IndexLink, Link} from 'react-router';
if (process.env.IS_BROWSER) require('./Header.scss');

const nav = [{
  to: '/about',
  text: 'About Me',
}, {
  to: '/non-existent-page',
  text: '404',
}];

export default class Header extends Component {
  render() {
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
}
