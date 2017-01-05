import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {Provider} from 'react-redux';
import {RouterContext, match} from 'react-router';
import {createMemoryHistory} from 'history';
import serialize from 'serialize-javascript';
import Helmet from 'react-helmet';
import NestedStatus from 'react-nested-status';

import {isProduction} from '../config';
import webpackIsomorphicTools from '../tools';
import {cachePage} from './cache';

import createRoutes from '../../app/createRoutes';

import runComponentFetchActions
  from '../../utils/universal-redux-fetch/runComponentFetchActions';

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
      document.documentElement.className = 'js';
      window.__INITIAL_STATE__ = ${serialize(state)};
    </script>
    <script async src="${jsFilename}"></script>
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

  if (!isProduction) {
    webpackIsomorphicTools.refresh();
  }

  const state = store.getState();
  const appHtml = getAppHtml(store, renderProps);
  const scriptHtml = getScriptHtml(state, jsFilename);

  const bodyHtml = `<div id="root">${appHtml}</div>${scriptHtml}`;

  return `<!doctype html>${
    ReactDOMServer.renderToStaticMarkup(
      <Html
        lang="en"
        helmet={Helmet.rewind()}
        bodyHtml={bodyHtml}
        cssFilename={isProduction ? cssFilename : null}
      />
    )
  }`;
}


/**
 * Handle requests to the frontend
 * and send responses appropriately
 *
 * @param url
 * @param store
 * @param res
 * @param next
 */
export default function render({url, store}, res, next) {
  if (!store) {
    next(new Error('The redux store was not initialized before rendering was attempted.'));
    return;
  }

  const routes = createRoutes();
  const location = createMemoryHistory().createLocation(url);

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
      await runComponentFetchActions(store, renderProps);
      const html = renderPage(store, renderProps);

      const nestedStatus = NestedStatus.rewind();

      // renderProps are always defined with * route
      // https://github.com/rackt/react-router/blob/master/docs/guides/advanced/ServerRendering.md
      const isNotFoundRoute = renderProps.routes.some(
        route => route.path === '*'
      );

      const status = isNotFoundRoute ? 404 : nestedStatus;

      res.status(status).send(html);

      if (status === 200) {
        cachePage(url, html);
      }
    } catch (e) {
      next(e);
    }
  });
}
