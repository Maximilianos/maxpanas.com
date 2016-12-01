import express from 'express';
import morgan from 'morgan';
import compression from 'compression';

import errorHandler from './errors/errorHandler';
import frontend from './frontend';

import content from './api/content';
import forms from './api/forms';

import {port} from './config';

const app = express();

// enable logging
app.use(morgan('dev'));

// enable gzip compression
app.use(compression());

// api handlers
app.use('/api/content', content);
app.use('/api/forms', forms);

// app handlers
app.use(frontend);

app.use(errorHandler);

app.listen(port, () => {
  console.log('Server listening at http://localhost:%s', port);
});
