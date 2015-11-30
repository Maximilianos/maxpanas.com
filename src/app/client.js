import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';

import {createRoutes} from './routes';

if (process.env.IS_BROWSER) {
  require('regenerator/runtime');
}

ReactDOM.render(
  <Router history={createBrowserHistory()}>
    {createRoutes()}
  </Router>,
  document.getElementById('app')
);
