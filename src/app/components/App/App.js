import React, {PropTypes} from 'react';
import NestedStatus from 'react-nested-status';
import Helmet from 'react-helmet';

import AppHeader from './AppHeader/AppHeader';
import AppFooter from './AppFooter/AppFooter';

import 'normalize.css';
import '../../assets/fonts/filson-pro/webfonts.css';
import '../../assets/fonts/avenir/webfonts.css';
import './base.scss';
import './App.scss';

import favicon from '../../assets/favicon/favicon.ico'; // eslint-disable-line

function App({children}) {
  return (
    <div className="app">

      <NestedStatus code={200} />
      <Helmet
        link={[{
          rel: 'shortcut icon',
          href: favicon
        }]}
        meta={[{
          name: 'description',
          content: 'My name is Max. I write code for the web. Sometimes ' +
                   'I share the code that I\'ve written. Sometimes I ' +
                   'give talks about code. This is my website. This is ' +
                   'where I focus on writing about code.'
        }]}
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

App.propTypes = {
  children: PropTypes.node
};

export default App;
