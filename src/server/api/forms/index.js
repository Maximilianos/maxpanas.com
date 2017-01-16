import express from 'express';
import bodyParser from 'body-parser';

import contact from './contact';

const app = express();

app.disable('x-powered-by');

app.use(bodyParser.json());


app.post('/contact', contact);


app.on('mount', () => {
  console.log('Form API available at %s', app.mountpath);
});

export default app;
