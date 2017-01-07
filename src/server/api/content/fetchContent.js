import fetch from 'isomorphic-fetch';
import {getResponseFromCache, putResponseInCache} from './cache';

import sha1 from 'sha1';
import {Base64} from 'js-base64';
import secrets from './secrets.json';


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
 * TODO: remove hardcoded basic authorization from here
 *
 * @param url
 * @param parser
 * @returns {*}
 */
async function fetchContent(url, {parser}) {
  try {
    const response = await fetch(url, {headers: new Headers({
      Authorization: `Basic ${Base64.encode(`${secrets.auth.login}:${secrets.auth.password}`)}`
    })});

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
 * Check if content exists in cache and fetch
 * it from there if it does, otherwise fetch it
 * from the given endpoint and parse it with the
 * given parser
 *
 * @param url
 * @param parser
 * @returns {Promise.<*>}
 */
export async function fetchContentCached(url, {parser}) {
  const resource = `${url}:${parser.name}:${sha1(parser)}`;

  const cachedResponse = await getResponseFromCache(resource);
  if (cachedResponse) {
    return cachedResponse;
  }

  const response = await fetchContent(url, {parser});

  if (response.status === 200) {
    putResponseInCache(resource, response);
  }

  return response;
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

    const response = await fetchContentCached(url, {parser});

    res
      .status(response.status)
      .json(response.payload);
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
