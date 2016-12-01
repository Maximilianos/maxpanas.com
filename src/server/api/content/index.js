import express from 'express';
import fetch from 'isomorphic-fetch';

const app = express();

app.get('/articles/:article', (req, res, next) => {

});

app.get('/archives/:archive', (req, res, next) => {

});

app.on('mount', () => {
  console.log('Content api available at %s', app.mountpath);
});

export default app;
