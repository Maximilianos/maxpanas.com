import React from 'react';
import ReactDOM from 'react-dom';
import {Router, browserHistory} from 'react-router';
import {Provider} from 'react-redux';
import Bluebird from 'bluebird';

import createRoutes from '../app/createRoutes';
import configureStore from '../app/redux/configureStore';

// http://bluebirdjs.com/docs/why-bluebird.html
window.Promise = Bluebird;

const initialState = window.__INITIAL_STATE__; // eslint-disable-line no-underscore-dangle
const store = configureStore(initialState);

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      {createRoutes()}
    </Router>
  </Provider>,
  document.getElementById('root')
);
