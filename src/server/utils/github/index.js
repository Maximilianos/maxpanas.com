import path from 'path';
import crypto from 'crypto';
import {union, unique} from '../../utils';


/**
 * Valid content directory names in the GitHub articles
 * repository
 *
 * @type {[*]}
 */
const VALID_ARCHIVES = [
  'articles'
];


/**
 * Middleware to verify that the request is a valid and
 * authorized GitHub push webhook event
 *
 * @param key
 * @returns function
 */
export function authWebhookPushRequest(key) {
  return (req, res, next) => {
    const requestToken = req
      .header('X-Hub-Signature')
      .slice('sha1='.length); // remove "sha1=" prefix from signature

    const verificationToken = crypto
      .createHmac('sha1', key)
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
  };
}


/**
 * Generic handler for reacting to GitHub Webhook requests
 *
 * @param payloadHandler
 * @returns {function({body: object}, object)}
 */
export function webhookHandler(payloadHandler) {
  return async ({body}, res) => {
    try {
      await payloadHandler(body);
      res.status(204).end();
    } catch (error) {
      // TODO: should rework error handling and logging here
      console.log(error);
      res.status(500).end();
    }
  };
}


/**
 * Extract the valid unique additions, removals and modifications
 * from a GitHub Push Event commits field
 *
 * @param commits
 * @returns {{additions:Array,removals:Array,modifications:Array}}
 */
export function getChangesFromCommits(commits) {
  return commits.reduce(
    ({additions, removals, modifications}, {added, removed, modified}) => ({
      additions: union(additions, validArchivesOnly(added)),
      removals: union(removals, validArchivesOnly(removed)),
      modifications: union(modifications, validArchivesOnly(modified))
    }), {
      additions: [],
      removals: [],
      modifications: []
    });
}


/**
 * Get an array of root archive names from a given list
 * of file URLs
 *
 * @param fileURLs
 * @returns {Array.<*>}
 */
export function getArchivesFromFileUrls(...fileURLs) {
  return union(...fileURLs)
    .map(getRootArchiveFromFileUrl)
    .filter(unique);
}


/**
 * Get an array of article file names from a given list
 * of file URLs
 *
 * @param fileURLs
 * @returns {Array.<*>}
 */
export function getArticlesFromFileUrls(...fileURLs) {
  return union(...fileURLs)
    .map(getArticleSlugFromFileUrl)
    .filter(unique);
}


/**
 * Get the root archive name for the given fileURL from
 * the GitHub repository
 *
 * @param fileURL string
 * @returns {string}
 */
function getRootArchiveFromFileUrl(fileURL) {
  return path.dirname(fileURL).split('/')[0];
}


/**
 * Get the file name for the given fileURL from the
 * GitHub repository
 *
 * @param fileURL string
 * @returns {string}
 */
function getArticleSlugFromFileUrl(fileURL) {
  const {name, ext} = path.parse(fileURL);
  return name.slice(0, -ext.length);
}


/**
 * Filter out any file paths to things that are
 * definitely not articles because they are not
 * in a valid article root directory
 *
 * @param filesPaths array
 * @returns {Array}
 */
function validArchivesOnly(filesPaths) {
  return filesPaths.filter(
    archive => VALID_ARCHIVES.includes(getRootArchiveFromFileUrl(archive))
  );
}
