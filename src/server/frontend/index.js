import path from 'path';
import express from 'express';
import compression from 'compression';
import favicon from 'serve-favicon';
import render from './render';

const app = express();

app.use(compression());

app.use(favicon(path.join(__dirname + '../../../../assets/favicon/favicon.ico')));
app.use('/assets/img', express.static('assets/img', {maxAge: '200d'}));
app.use('/_assets', express.static('build', {maxAge: '200d'}));

app.get('*', render);

app.on('mount', () => {
  console.log('App is available at %s', app.mountpath);
});

export default app;
