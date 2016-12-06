import fetch from 'isomorphic-fetch';

/**
 * Error messages for given status codes
 *
 * @type {{string}}
 */
const errors = {
  404: 'The requested content does not exist',
  500: 'There was an error fetching the requested content'
};


/**
 * Fetch content from the given endpoint and
 * parse it with the given parser
 *
 * TODO: implement conditional requests https://developer.github.com/v3/#conditional-requests
 *
 * @param endpoint
 * @param parser
 * @returns {function(*=, *)}
 */
export default function fetchContent({endpoint, parser}) {
  return async (req, res) => {
    try {
      const response = await fetch(isFunc(endpoint) ? endpoint(req) : endpoint);
      if (response.status !== 200) {
        const status = response.status === 404 ? 404 : 500;
        res.status(status).json({error: {
          status,
          message: errors[status]
        }});
        return;
      }

      const output = isFunc(parser)
        ? await parser(response)
        : response;

      res.status(200).json(output);

    } catch (error) {
      res.status(500).json({error: {
        status: 500,
        message: errors[500]
      }});
    }
  };
}


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
