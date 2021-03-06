import moment from 'moment';
import parseLinks from 'parse-link-header';
import {fetchContentCached} from '../fetchContent';


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
  to: outputFormat = 'DD/MM/YYYY'
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
      throw new TypeError('Payload must be an array in order to be collated');
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
      throw new Error('Collation failed because one of the requests failed');
    }

    return payload.concat(nextPayload);
  };
}
