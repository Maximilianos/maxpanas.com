if (!process.env.NODE_ENV) {
  throw new Error(
    'Environment variable NODE_ENV must be ' +
    'set to development or production'
  );
}

require('babel-register');
require('./tools');
