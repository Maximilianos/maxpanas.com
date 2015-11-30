import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {RoutingContext, match} from 'react-router';
import {createMemoryHistory} from 'history';

import {HOT_RELOAD_PORT} from '../../../webpack/constants';
import {createRoutes} from '../../app/routes';
import Html from './Html';

function getAppHtml(renderProps) {
  return ReactDOMServer.renderToString(
    <RoutingContext {...renderProps} />
  );
}

function getScriptHtml({hostname, filename}) {
  const appScriptSrc = process.env.NODE_ENV === 'production'
    ? `/_assets/${filename}`
    : `//${hostname}:${HOT_RELOAD_PORT}/build/app.js`;

  return `<script src="${appScriptSrc}"></script>`;
}

function renderPageAsync({renderProps, req: {hostname}}) {
  const appHtml = getAppHtml(renderProps);
  const scriptHtml = getScriptHtml({hostname});

  const bodyHtml = `<div id="app">${appHtml}</div>${scriptHtml}`;

  return '<!doctype html>' + ReactDOMServer.renderToStaticMarkup(
    <Html lang="en" bodyHtml={bodyHtml} />
  );
}

export default function render(req, res, next) {
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
      const html = await renderPageAsync({renderProps, req});
      res.send(html);
    } catch (e) {
      next(e);
    }
  });
}
