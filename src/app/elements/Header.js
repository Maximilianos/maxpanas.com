import React, {Component} from 'react';
import {IndexLink, Link} from 'react-router';
if (process.env.IS_BROWSER) require('./Header.scss');

export default class Header extends Component {
  render() {
    return (
      <header className="header">
        <h1 className="reset">
          <IndexLink to="/" className="logo">
            <abbr title="Max GJ Panas">
              MAX
            </abbr>
          </IndexLink>
        </h1>
        <nav>
          <ul className="reset">
            <li className="navItem">
              <Link to="/about" className="navLink">
                About Me
              </Link>
            </li>
            <li className="navItem">
              <Link to="/asdasdasdas" className="navLink">
                404
              </Link>
            </li>
          </ul>
        </nav>
      </header>
    );
  }
}
