import express from 'express';
import morgan from 'morgan';
import compression from 'compression';

import forms from './forms';
import frontend from './frontend';
import errorHandler from './errors/errorHandler';

import {port} from './config';

const app = express();

// enable logging
app.use(morgan('dev'));

// enable gzip compression
app.use(compression());

// app handlers
app.use(frontend);
app.use('/api/forms', forms);
app.use(errorHandler);

app.listen(port, () => {
  console.log('Server listening at http://localhost:%s', port);
});
