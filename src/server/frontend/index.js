import express from 'express';
import favicon from 'serve-favicon';
import bodyParser from 'body-parser';

// middleware and request handlers
import {authWebhookPushRequest} from './cache/github';
import {pageCacheMiddleware, updateCache} from './cache';
import createStore from './createStore';
import contact from './forms/contact';
import render from './render';

const urlDecode = bodyParser.urlencoded({extended: false});
const jsonDecode = bodyParser.json();

const app = express();

app.disable('x-powered-by');

app.use(favicon('src/app/assets/favicon/favicon.ico'));

// hook up static file serving
app.use('/assets', express.static('build', {maxAge: '200d'}));


// serve the frontend of the app
app.get('*', pageCacheMiddleware, createStore, render);


// handle a no-js contact form submission
app.post('/contact', urlDecode, createStore, contact, render);


/**
 * Github Webhook listener to update the relevant parts of
 * the frontend cache when a change is made to the
 * content repository
 */
app.post('/update-cache', jsonDecode, authWebhookPushRequest, updateCache);


app.on('mount', () => {
  console.log('App is available at %s', app.mountpath);
});

export default app;
