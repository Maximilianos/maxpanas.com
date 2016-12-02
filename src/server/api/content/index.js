import express from 'express';
import fetchContent from './fetchContent';
import {
  getArticlePath,
  getArchivePath,
  parseArticle,
  parseArchive
} from './github';

const app = express();

app.get('/articles/:article', fetchContent({
  endpoint: req => getArticlePath(req.params.article),
  parser: parseArticle
}));

app.get('/archives/:archive', fetchContent({
  endpoint: req => getArchivePath(req.params.archive),
  parser: parseArchive
}));

app.on('mount', () => {
  console.log('Content API available at %s', app.mountpath);
});

export default app;
