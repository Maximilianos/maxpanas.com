import express from 'express';

import frontend from './frontend';

const app = express();

app.use(frontend);

const host = 'localhost';
const port = 3000;
app.listen(port, host, () => {
  console.log('Server listening at http://%s:%s', host, port);
});
