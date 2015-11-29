import express from 'express';

const app = express();

app.get('*', (req, res) => {
  res.send('Hello!');
});

const port = 3000;
app.listen(port, () => {
  global.console.log(`Server listening at http://localhost:${port}`);
});
