import React, {PropTypes} from 'react';
import NestedStatus from 'react-nested-status';
import Helmet from 'react-helmet';

import AppHeader from './AppHeader/AppHeader';
import AppFooter from './AppFooter/AppFooter';

import 'normalize.css';
import '../../assets/fonts/filson-pro/webfonts.css';
import '../../assets/fonts/avenir/webfonts.css';
import './App.scss';

import favicon from '../../assets/favicon/favicon.ico'; // eslint-disable-line

function App({children}) {
  return (
    <div>
      <NestedStatus code={200} />
      <Helmet
        link={[{
          rel: 'shortcut icon',
          href: favicon
        }]}
        meta={[{
          name: 'description',
          content: 'Developer blog'
        }]}
        titleTemplate="%s - Max GJ Panas"
      />
      <AppHeader />
      {children}
      <AppFooter />
    </div>
  );
}

App.propTypes = {
  children: PropTypes.node
};

export default App;
