import React from 'react';
import ReactDOMServer from 'react-dom/server';

import Html from './Html';

function renderPageAsync() {
  return '<!doctype html>' + ReactDOMServer.renderToStaticMarkup(
    <Html lang="en"
          bodyHtml="Hello!"
    />
  );
}

export default function render(req, res, next) {
  try {
    const html = renderPageAsync();
    res.send(html);
  } catch (error) {
    next(error);
  }
}
