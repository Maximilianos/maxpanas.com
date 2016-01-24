import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {RouterContext, match} from 'react-router';
import {createMemoryHistory} from 'history';

import config from '../config';
import createRoutes from '../../app/createRoutes';

import Html from './Html';


/**
 * Render the application's
 * HTML to a string
 *
 * @param renderProps
 * @returns {string}
 */
function getAppHtml(renderProps) {
  return ReactDOMServer.renderToString(
    <RouterContext {...renderProps} />
  );
}


/**
 * Render the application's
 * scripts to a string
 *
 * @param jsFilename
 * @returns {string}
 */
function getScriptHtml(jsFilename) {
  return `<script src="${jsFilename}"></script>`;
}


/**
 * Render the full markup of
 * a page for a given request
 *
 * @param renderProps
 * @returns {string}
 */
function renderPage(renderProps) {
  const {
    styles: {app: cssFilename},
    javascript: {app: jsFilename}
  } = webpackIsomorphicTools.assets();

  if (!config.isProduction) {
    webpackIsomorphicTools.refresh();
  }

  const appHtml = getAppHtml(renderProps);
  const scriptHtml = getScriptHtml(jsFilename);

  const bodyHtml = `<div id="root">${appHtml}</div>${scriptHtml}`;

  return '<!doctype html>' + ReactDOMServer.renderToStaticMarkup(
      <Html
        lang="en"
        bodyHtml={bodyHtml}
        cssFilename={config.isProduction && cssFilename}
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
  const routes = createRoutes();
  const location = createMemoryHistory().createLocation(req.url);

  match({routes, location}, (error, redirectLocation, renderProps) => {
    if (redirectLocation) {
      res.redirect(301, redirectLocation.pathname + redirectLocation.search);
      return;
    }

    if (error) {
      next(error);
      return;
    }

    try {
      const html = renderPage(renderProps);

      // renderProps are always defined with * route
      const isNotFoundRoute = renderProps.routes
        .some(route => route.path === '*');

      const status = isNotFoundRoute ? 404 : 200;

      res.status(status).send(html);
    } catch (e) {
      next(e);
    }
  });
}
