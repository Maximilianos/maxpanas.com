import express from 'express';
import fetch from 'isomorphic-fetch';
import {
  getArticlePath,
  getArchivePath,
  parseArticle,
  parseArchive
} from './github';

const app = express();

app.get('/articles/:article', async (req, res) => {
  try {
    const response = await fetch(getArticlePath(req.params.article));
    const json = await parseArticle(response);
    res.status(200).send(json);
  } catch (error) {
    res.status(500).send({error});
  }
});

app.get('/archives/:archive', async (req, res) => {
  try {
    const response = await fetch(getArchivePath(req.params.archive));
    const json = await parseArchive(response);
    res.status(200).send(json);
  } catch (error) {
    res.status(500).send({error});
  }
});

app.on('mount', () => {
  console.log('Content API available at %s', app.mountpath);
});

export default app;
