import express from 'express';
import favicon from 'serve-favicon';
import bodyParser from 'body-parser';

import createStore from './createStore';
import contact from './forms/contact';
import render from './render';

import {authWebhookPushRequest, webhookHandler} from '../utils/github';
import {pageCacheMiddleware, updateCache} from './cache';

const app = express();

app.disable('x-powered-by');

app.use(favicon('src/app/assets/favicon/favicon.ico'));

// hook up static file serving
app.use('/assets', express.static('build', {maxAge: '200d'}));


/**
 * Handle all normal rendering of the website
 */
app.get('*', pageCacheMiddleware, createStore, render);


/**
 * Endpoint to handle when a submission is made to the contact form
 * from a user with no javascript
 */
app.post(
  '/contact',
  bodyParser.urlencoded({extended: false}),
  createStore,
  contact,
  render
);


/**
 * Endpoint to handle a Github Webhook push event to update the
 * relevant parts of the frontend cache when a change is made to
 * the content repository
 */
app.post(
  '/update-cache',
  bodyParser.json(),
  authWebhookPushRequest(process.env.GITHUB_SECRET_FRONTEND_UPDATE),
  webhookHandler(updateCache)
);


app.on('mount', () => {
  console.log('App is available at %s', app.mountpath);
});

export default app;
