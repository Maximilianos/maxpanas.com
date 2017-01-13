import express from 'express';
import bodyparser from 'body-parser';

import fetchContentMiddleware from './fetchContent';
import {getArticlePath, parseArticle} from './github/types/article';
import {getArchivePath, parseArchive} from './github/types/archive';

import {updateCache} from './cache';
import {authWebhookPushRequest, webhookHandler} from '../../utils/github';

import secrets from './secrets.json';


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


/**
 * Github Webhook listener to update the relevant parts of
 * the content API cache when a change is made to the
 * content repository
 */
app.post(
  '/update-cache',
  bodyparser.json(),
  authWebhookPushRequest(secrets.hooks.updateCache.secret),
  webhookHandler(updateCache)
);


app.on('mount', () => {
  console.log('Content API available at %s', app.mountpath);
});

export default app;
