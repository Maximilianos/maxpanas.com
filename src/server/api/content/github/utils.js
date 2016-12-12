import moment from 'moment';
import parseLinks from 'parse-link-header';
import {fetchContent} from '../fetchContent';


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
}) {
  return moment(dateString, inputFormat)
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

    const {payload: nextPayload} = await fetchContent(next.url, {
      parser: collatingParser
    });

    if (nextPayload.error) {
      throw new Error('Error: Collation failed because one of the requests to failed');
    }

    return payload.concat(nextPayload);
  };
}
