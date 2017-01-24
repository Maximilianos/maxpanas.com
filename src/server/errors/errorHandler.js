import * as config from '../config';


/**
 * Display errors in a better
 * way on client and server
 *
 * @param err
 * @param req
 * @param res
 * @param next
 */
export default function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const errorDetails = err.stack || err;

  console.error('Error:', errorDetails);

  res.status(500).format({
    json() {
      const errorInfo = {error: err.toString()};
      if (!config.isProduction) errorInfo.details = errorDetails;

      res.send(errorInfo);
    },

    html() {
      const message = config.isProduction
        ? '<p>Something went wrong</p>'
        : `<pre>${errorDetails}</pre>`;

      res.send(`<h1>500 Internal server error</h1>\n${message}`);
    },

    default() {
      const message = config.isProduction
        ? 'Something went wrong'
        : `${errorDetails}`;

      res.send(`500 Internal server error:\n${message}`);
    }
  });
}
