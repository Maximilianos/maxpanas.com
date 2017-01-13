import express from 'express';
import favicon from 'serve-favicon';
import bodyParser from 'body-parser';

import createStore from './createStore';
import contact from './forms/contact';
import render from './render';

import {authWebhookPushRequest, webhookHandler} from '../utils/github';
import {pageCacheMiddleware, updateCache} from './cache';

import secrets from './secrets.json';


const app = express();

app.disable('x-powered-by');

app.use(favicon('src/app/assets/favicon/favicon.ico'));

// hook up static file serving
app.use('/assets', express.static('build', {maxAge: '200d'}));


// serve the frontend of the app
app.get('*', pageCacheMiddleware, createStore, render);


// handle a no-js contact form submission
app.post(
  '/contact',
  bodyParser.urlencoded({extended: false}),
  createStore,
  contact,
  render
);


/**
 * Github Webhook listener to update the relevant parts of
 * the frontend cache when a change is made to the
 * content repository
 */
app.post(
  '/update-cache',
  bodyParser.json(),
  authWebhookPushRequest(secrets.hooks.updateCache.secret),
  webhookHandler(updateCache)
);


app.on('mount', () => {
  console.log('App is available at %s', app.mountpath);
});

export default app;
