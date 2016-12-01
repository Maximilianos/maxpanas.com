import express from 'express';
import fetch from 'isomorphic-fetch';
import {
  getArticlePath,
  parseArticle
} from './github';

const app = express();

app.get('/articles/:article', async (req, res) => {
  try {
    const response = await fetch(getArticlePath(req.params.article));
    const json = await parseArticle()(response);
    res.status(200).send(json);
  } catch (error) {
    res.status(500).send({
      fuck: 'you'
    });
  }
});

app.get('/archives/:archive', async (req, res) => {

});

app.on('mount', () => {
  console.log('Content API available at %s', app.mountpath);
});

export default app;
