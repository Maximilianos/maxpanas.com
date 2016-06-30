import React from 'react';
import ReactDOM from 'react-dom';
import {Router, browserHistory, applyRouterMiddleware} from 'react-router';
import useScroll from 'react-router-scroll';
import {Provider} from 'react-redux';

import createRoutes from '../app/createRoutes';
import configureStore from '../app/redux/configureStore';

const initialState = window.__INITIAL_STATE__; // eslint-disable-line no-underscore-dangle
const store = configureStore(initialState);

ReactDOM.render(
  <Provider store={store}>
    <Router
      history={browserHistory}
      routes={createRoutes()}
      render={applyRouterMiddleware(useScroll())}
    />
  </Provider>,
  document.getElementById('root')
);
