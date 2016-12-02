import fetch from 'isomorphic-fetch';


/**
 * Fetch content from the given endpoint and
 * parse it with the given parser
 *
 * @param endpoint
 * @param parser
 * @returns {function(*=, *)}
 */
export default function fetchContent({endpoint, parser}) {
  return async (req, res) => {
    try {
      const response = await fetch(isFunc(endpoint) ? endpoint(req) : endpoint);
      const output = isFunc(parser) ? await parser(response) : response;

      res.status(200).json(output);

    } catch (error) {
      res.status(500).json({error});
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
