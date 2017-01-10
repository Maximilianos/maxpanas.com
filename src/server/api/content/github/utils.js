import crypto from 'crypto';
import moment from 'moment';
import parseLinks from 'parse-link-header';
import {fetchContentCached} from '../fetchContent';
import secrets from '../secrets.json';


/**
 * Format a given date string to the format required
 * for the front end
 *
 * @param dateString
 * @param inputFormat
 * @param outputFormat
 * @returns {string}
 */
export function formatDate(dateString, {
  from: inputFormat,
  to: outputFormat = 'YYYY/MM/DD'
} = {}) {
  return dateString && moment(dateString, inputFormat)
    .format(outputFormat);
}


/**
 * Simplistic remove extension from
 * file path
 *
 * @param {string} path
 * @returns {string}
 */
export function removeFileExtension(path) {
  return path.slice(0, path.indexOf('.'));
}


/**
 * Follow the GitHub Api's 'next' header Links and
 * collate the responses until all the data has
 * been collected
 *
 * @param parser
 * @returns {function}
 */
export function collatePaginatedContent(parser) {
  return async function collatingParser(response) {
    const payload = await parser(response);
    if (!Array.isArray(payload)) {
      throw new TypeError('Error: Payload must be an array in order to be collated');
    }

    const linkHeader = response.headers.get('Link');
    if (!linkHeader) {
      return payload;
    }

    const {next} = parseLinks(linkHeader);
    if (!next) {
      return payload;
    }

    const {payload: nextPayload} = await fetchContentCached(next.url, {
      parser: collatingParser
    });

    if (nextPayload.error) {
      throw new Error('Error: Collation failed because one of the requests failed');
    }

    return payload.concat(nextPayload);
  };
}


/**
 * Middleware to verify that the request is a valid and
 * authorized GitHub push webhook event
 *
 * @param req
 * @param res
 * @param next
 */
export function authWebhookPushRequest(req, res, next) {
  const requestToken = req
    .header('X-Hub-Signature')
    .slice('sha1='.length); // remove "sha1=" prefix from signature

  const verificationToken = crypto
    .createHmac('sha1', secrets.hooks.contentUpdated.secret)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (
    req.header('User-Agent').indexOf('GitHub-Hookshot/') !== 0
    || req.header('X-GitHub-Event') !== 'push'
    || requestToken !== verificationToken
  ) {
    res.status(403).json({
      error: 'You are not authorized to perform this action.'
    });
    return;
  }

  next();
}
