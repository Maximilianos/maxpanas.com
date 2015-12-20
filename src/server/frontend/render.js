import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {RoutingContext, match} from 'react-router';
import {createMemoryHistory} from 'history';

import config from '../config';
import {HOT_RELOAD_PORT} from '../../../webpack/constants';
import getAppAssetFilenamesAsync from './assets';

import {createRoutes} from '../../app/routes';
import Html from './Html';

let appAssetFilenameCache = null;
async function getAppAssetFilenamesCachedAsync() {
  if (appAssetFilenameCache) {
    return appAssetFilenameCache;
  }

  appAssetFilenameCache = await getAppAssetFilenamesAsync();
  return appAssetFilenameCache;
}

function getAppHtml(renderProps) {
  return ReactDOMServer.renderToString(
    <RoutingContext {...renderProps} />
  );
}

function getScriptHtml({hostname, filename}) {
  const appScriptSrc = process.env.NODE_ENV === 'production'
    ? `/public/${filename}`
    : `//${hostname}:${HOT_RELOAD_PORT}/build/app.js`;

  return `<script src="${appScriptSrc}"></script>`;
}

async function renderPageAsync({renderProps, req: {hostname}}) {
  const appHtml = getAppHtml(renderProps);
  const {js: jsFilename, css: cssFilename} = await getAppAssetFilenamesCachedAsync();
  const scriptHtml = getScriptHtml({hostname, jsFilename});

  const bodyHtml = `<div id="app">${appHtml}</div>${scriptHtml}`;

  return '<!doctype html>' + ReactDOMServer.renderToStaticMarkup(
    <Html
      lang="en"
      bodyHtml={bodyHtml}
      cssFilename={cssFilename}
      isDevelopment={config.isDevelopment}
    />
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
