import webpack from 'webpack';
import webpackDev from 'webpack-dev-middleware';
import webpackHot from 'webpack-hot-middleware';
import express from 'express';

import getWebpackConfig from '../getConfig';

const app = express();

const webpackConfig = getWebpackConfig();
const compiler = webpack(webpackConfig);

app.use(webpackDev(compiler, {
  headers: {'Access-Control-Allow-Origin': '*'},
  noInfo: true,
  publicPath: webpackConfig.output.publicPath,
}));

app.use(webpackHot(compiler));

const host = 'localhost';
const port = webpackConfig.hotPort;
app.listen(port, host, () => {
  console.log('Hot server listening at http://%s:%s', host, port);
});
