// polyfill the fetch api for the browsers that don't support it
import 'isomorphic-fetch';

import React from 'react';
import ReactDOM from 'react-dom';
import {Router, browserHistory, applyRouterMiddleware} from 'react-router';
import useScroll from 'react-router-scroll';
import {Provider} from 'react-redux';
import ReactGa from 'react-ga';

import createRoutes from '../app/createRoutes';
import configureStore from '../app/redux/configureStore';

const initialState = window.__INITIAL_STATE__; // eslint-disable-line no-underscore-dangle
const store = configureStore(initialState);

const routes = createRoutes();
const renderer = applyRouterMiddleware(useScroll());

let logPageView;
if (process.env.GA_TRACKING_ID) {
  ReactGa.initialize(process.env.GA_TRACKING_ID);
  logPageView = () => {
    ReactGa.set({page: window.location.pathname});
    ReactGa.pageview(window.location.pathname);
  };
}

ReactDOM.render(
  <Provider store={store}>
    <Router
      history={browserHistory}
      routes={routes}
      render={renderer}
      onUpdate={logPageView}
    />
  </Provider>,
  document.getElementById('root')
);
