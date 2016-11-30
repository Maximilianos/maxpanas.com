import express from 'express';
import favicon from 'serve-favicon';
import bodyParser from 'body-parser';

// middleware and request handlers
import createStore from './createStore';
import contact from './formHandlers/contact';
import render from './render';

const app = express();

app.use(favicon('src/app/assets/favicon/favicon.ico'));

// hook up static file serving
app.use('/assets', express.static('build', {maxAge: '200d'}));

// make sure every request has a store instance
app.use(createStore);

// serve the frontend of the app
app.get('*', render);

// handle a contact form submission
app.post(
  '/contact',
  bodyParser.urlencoded({extended: false}),
  contact,
  render
);

app.on('mount', () => {
  console.log('App is available at %s', app.mountpath);
});

export default app;
