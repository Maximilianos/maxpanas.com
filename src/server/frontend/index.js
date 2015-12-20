import express from 'express';
import compression from 'compression';
import favicon from 'serve-favicon';
import render from './render';

const app = express();

app.use(compression());

app.use(favicon('assets/favicon/favicon.ico'));

app.use('/assets', express.static('assets', {maxAge: '200d'}));
app.use('/public', express.static('build', {maxAge: '200d'}));

app.get('*', render);

app.on('mount', () => {
  console.log('App is available at %s', app.mountpath);
});

export default app;
