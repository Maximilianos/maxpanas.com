// Remember, never put production secrets in config. Use nconf.
const config = {
  isProduction: process.env.NODE_ENV === 'production',
  port: process.env.PORT || 8000
};

export default config;
