import fetch from 'isomorphic-fetch';


/**
 * Return whether a given thing is a function
 * or not
 *
 * @param thing
 * @returns {boolean}
 */
function isFunc(thing) {
  return typeof thing === 'function';
}


/**
 * Return the error response for the given status
 * code
 *
 * @param {number} status
 * @returns {{status: *, payload: {error: {status: *, message: *}}}}
 */
function fetchError(status) {
  const errors = {
    404: 'The requested content does not exist',
    500: 'There was an error fetching the requested content'
  };

  return {
    status,
    payload: {error: {
      status,
      message: errors[status] || errors[500]
    }}
  };
}


/**
 * Fetch content from the given endpoint and
 * parse it with the given parser
 *
 * TODO: implement conditional requests https://developer.github.com/v3/#conditional-requests
 *
 * @param req
 * @param endpoint
 * @param parser
 * @returns {*}
 */
async function fetchContent(req, {endpoint, parser}) {
  try {
    const response = await fetch(isFunc(endpoint) ? endpoint(req) : endpoint);
    const {status} = response;
    if (status !== 200) {
      return fetchError(status === 404 ? 404 : 500);
    }

    const payload = isFunc(parser)
      ? await parser(response)
      : response;

    return {status, payload};
  } catch (error) {
    return fetchError(500);
  }
}


/**
 * Respond to content request with fetched and
 * parsed content
 *
 * @param endpoint
 * @param parser
 * @returns {function(*=, *)}
 */
export default function fetchContentHandler({endpoint, parser}) {
  return async (req, res) => {
    const {status, payload} = await fetchContent(req, {endpoint, parser});
    res.status(status).json(payload);
  };
}
