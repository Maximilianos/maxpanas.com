import express from 'express';

import {port} from './config';

import frontend from './frontend';
import errorHandler from './errors/errorHandler';

const app = express();

app.use(frontend);
app.use(errorHandler);

app.listen(port, () => {
  console.log('Server listening at http://localhost:%s', port);
});
