import React, {PropTypes} from 'react';
import NestedStatus from 'react-nested-status';
import Helmet from 'react-helmet';

import AppHeader from './AppHeader/AppHeader';
import AppFooter from './AppFooter/AppFooter';

// fonts
import '../../assets/fonts/inconsolata/webfonts.css';
import '../../assets/fonts/filson-pro/webfonts.css';
import '../../assets/fonts/avenir/webfonts.css';

// vendor styles
import 'normalize.css';
import 'highlight.js/styles/atom-one-light.css';

// base styles
import './base.scss';

import './App.scss';

import favicon from '../../assets/favicon/favicon.ico';


App.propTypes = {
  children: PropTypes.node
};
export default function App({children}) {
  return (
    <div className="app">

      <NestedStatus code={200} />
      <Helmet
        link={[{rel: 'shortcut icon', href: favicon}]}
        titleTemplate="%s - Max GJ Panas"
      />

      <div className="app__content">
        <AppHeader />
        {children}
      </div>

      <div className="app__footer">
        <AppFooter />
      </div>

    </div>
  );
}
