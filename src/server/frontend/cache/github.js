import crypto from 'crypto';
import secrets from '../secrets.json';


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
