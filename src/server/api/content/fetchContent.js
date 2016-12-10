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
    403: 'The requested content is not available',
    500: 'There was an error fetching the requested content'
  };

  return {
    status: errors[status] ? status : 500,
    payload: {error: errors[status] || errors[500]}
  };
}


/**
 * Fetch content from the given endpoint and
 * parse it with the given parser
 *
 * TODO: implement conditional requests https://developer.github.com/v3/#conditional-requests
 *
 * @param url
 * @param parser
 * @returns {*}
 */
export async function fetchContent(url, {parser}) {
  try {
    const response = await fetch(url);
    const {status} = response;

    if (status !== 200) {
      return fetchError(status === 404 ? 404 : 500);
    }

    const payload = isFunc(parser)
      ? await parser(response)
      : response;

    return {status, payload};
  } catch (error) {
    console.log(error);
    return fetchError(error.status);
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
export default function fetchContentMiddlewareFactory({endpoint, parser}) {
  return async (req, res) => {
    const url = isFunc(endpoint)
      ? endpoint(req)
      : endpoint;

    const {status, payload} = await fetchContent(url, {parser});
    res.status(status).json(payload);
  };
}


/**
 * Really simple error class to represent
 * a forbidden response
 *
 */
export class ResponseForbiddenError {
  constructor() {
    this.status = 403;
  }
}
