import express from 'express';
import favicon from 'serve-favicon';
import bodyParser from 'body-parser';

// middleware and request handlers
import {cacheMiddleware} from '../cache';
import createStore from './createStore';
import contact from './forms/contact';
import render from './render';

const urlDecode = bodyParser.urlencoded({extended: false});

const app = express();

app.use(favicon('src/app/assets/favicon/favicon.ico'));

// hook up static file serving
app.use('/assets', express.static('build', {maxAge: '200d'}));

// serve the frontend of the app
app.get('*', cacheMiddleware, createStore, render);

// handle a no-js contact form submission
app.post('/contact', urlDecode, createStore, contact, render);

app.on('mount', () => {
  console.log('App is available at %s', app.mountpath);
});

export default app;
