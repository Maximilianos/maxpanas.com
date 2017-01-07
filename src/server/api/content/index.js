import express from 'express';

import fetchContentMiddleware from './fetchContent';
import {getArticlePath, parseArticle} from './github/types/article';
import {getArchivePath, parseArchive} from './github/types/archive';

const app = express();

app.disable('x-powered-by');

app.get('/articles/:article', fetchContentMiddleware({
  endpoint: req => getArticlePath(req.params.article),
  parser: parseArticle
}));

app.get('/archives/:archive', fetchContentMiddleware({
  endpoint: req => getArchivePath(req.params.archive),
  parser: parseArchive
}));

app.on('mount', () => {
  console.log('Content API available at %s', app.mountpath);
});

export default app;
