import express from 'express';
import bodyParser from 'body-parser';

import fetchContentMiddleware from './fetchContent';
import {getArticlePath, parseArticle} from './github/types/article';
import {getArchivePath, parseArchive} from './github/types/archive';

import {updateCache} from './cache';
import {authWebhookPushRequest, webhookHandler} from '../../utils/github';

const app = express();

const headers = process.env.GITHUB_AUTH_TOKEN && new Headers({
  Authorization: `token ${process.env.GITHUB_AUTH_TOKEN}`
});

app.disable('x-powered-by');


app.get('/articles/:article', fetchContentMiddleware({
  endpoint: req => getArticlePath(req.params.article),
  parser: parseArticle,
  headers
}));


app.get('/archives/:archive', fetchContentMiddleware({
  endpoint: req => getArchivePath(req.params.archive),
  parser: parseArchive,
  headers
}));


/**
 * Github Webhook listener to update the relevant parts of
 * the content API cache when a change is made to the
 * content repository
 */
app.post(
  '/update-cache',
  bodyParser.json(),
  authWebhookPushRequest(process.env.GITHUB_SECRET_CONTENT_UPDATE),
  webhookHandler(updateCache)
);


app.on('mount', () => {
  console.log('Content API available at %s', app.mountpath);
});

export default app;
