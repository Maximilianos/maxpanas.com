if (['development', 'production'].indexOf(process.env.NODE_ENV) === -1) {
  throw new Error(
    'Environment variable NODE_ENV must be ' +
    'set to development or production'
  );
}

require('babel-register');

// polyfill the fetch api for node.js
require('isomorphic-fetch');

require('./tools');
