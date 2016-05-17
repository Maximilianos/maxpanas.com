/**
 * Remember, never put production secrets in config. Use nconf.
 *
 */
export const isProduction = process.env.NODE_ENV === 'production';
export const port = process.env.PORT || 8000;
