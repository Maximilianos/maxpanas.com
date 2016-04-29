if (!process.env.NODE_ENV) {
  throw new Error(
    'Environment variable NODE_ENV must be ' +
    'set to development or production'
  );
}

require('babel-register');
require('isomorphic-fetch');

// http://bluebirdjs.com/docs/why-bluebird.html
global.Promise = require('bluebird');

const rootDir = require('path').resolve(__dirname, '..', '..');

const WebpackIsomorphicTools = require('webpack-isomorphic-tools');
const webpackIsomorphicAssets = require('../../webpack/assets');

const config = require('./config');

global.webpackIsomorphicTools = (
  new WebpackIsomorphicTools(webpackIsomorphicAssets)
  .development(!config.isProduction)
  .server(rootDir, () => global.require('./main'))
);
