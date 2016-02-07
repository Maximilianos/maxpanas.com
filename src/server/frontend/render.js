import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {Provider} from 'react-redux';
import {RouterContext, match} from 'react-router';
import {createMemoryHistory} from 'history';
import serialize from 'serialize-javascript';
import Helmet from 'react-helmet';

import config from '../config';
import createRoutes from '../../app/createRoutes';
import configureStore from '../../app/configureStore';

import {fetchComponentDataAsync} from '../../utils/redux-universal-fetch/server';

import Html from './Html';


/**
 * Render the application's
 * HTML to a string
 *
 * @param store
 * @param renderProps
 * @returns {string}
 */
function getAppHtml(store, renderProps) {
  return ReactDOMServer.renderToString(
    <Provider store={store}>
      <RouterContext {...renderProps} />
    </Provider>
  );
}


/**
 * Render the application's
 * scripts to a string
 *
 * @param state
 * @param jsFilename
 * @returns {string}
 */
function getScriptHtml(state, jsFilename) {
  return `
    <script>
      window.__INITIAL_STATE__ = ${serialize(state)};
    </script>
    <script src="${jsFilename}"></script>
  `;
}


/**
 * Render the full markup of
 * a page for a given request
 *
 * @param store
 * @param renderProps
 * @returns {string}
 */
function renderPage(store, renderProps) {
  const {
    styles: {app: cssFilename},
    javascript: {app: jsFilename}
  } = webpackIsomorphicTools.assets();

  if (!config.isProduction) {
    webpackIsomorphicTools.refresh();
  }

  const state = store.getState();
  const appHtml = getAppHtml(store, renderProps);
  const scriptHtml = getScriptHtml(state, jsFilename);

  const bodyHtml = `<div id="root">${appHtml}</div>${scriptHtml}`;

  return '<!doctype html>' + ReactDOMServer.renderToStaticMarkup(
      <Html
        lang="en"
        helmet={Helmet.rewind()}
        bodyHtml={bodyHtml}
        cssFilename={config.isProduction ? cssFilename : null}
      />
    );
}


/**
 * Handle requests to the frontend
 * and send responses appropriately
 *
 * @param req
 * @param res
 * @param next
 */
export default function render(req, res, next) {
  const store = configureStore();

  const routes = createRoutes();
  const location = createMemoryHistory().createLocation(req.url);

  match({routes, location}, async (error, redirectLocation, renderProps) => {
    if (redirectLocation) {
      res.redirect(301, redirectLocation.pathname + redirectLocation.search);
      return;
    }

    if (error) {
      next(error);
      return;
    }

    try {
      await fetchComponentDataAsync(store, renderProps);
      const html = renderPage(store, renderProps);

      // renderProps are always defined with * route
      // https://github.com/rackt/react-router/blob/master/docs/guides/advanced/ServerRendering.md
      const isNotFoundRoute = renderProps.routes.some(
        route => route.path === '*'
      );

      const status = isNotFoundRoute ? 404 : 200;

      res.status(status).send(html);
    } catch (e) {
      next(e);
    }
  });
}
