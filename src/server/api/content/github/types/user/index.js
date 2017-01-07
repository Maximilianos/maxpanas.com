import {USERS_API} from '../../config';
import {fetchContentCached} from '../../../fetchContent';


/**
 * Fetch author data for the given
 * usernames
 *
 * @param usernames
 * @returns {*}
 */
export async function fetchUserData(usernames) {
  const requests = usernames.map(username => fetchContentCached(
    getUserPath(username),
    {parser: parseUser})
  );

  const data = await Promise.all(requests);
  return data.map(({payload}) => payload);
}


/**
 * Return the api endpoint on
 * github for the given user
 *
 * @param username
 * @returns {string}
 */
function getUserPath(username) {
  return `${USERS_API}/${username}`;
}


/**
 * Parse a response from the
 * GitHub Api into an author
 *
 * @param response
 * @returns {{username, avatar, name}}
 */
async function parseUser(response) {
  const {login, avatar_url, name} = await response.json();
  return {
    username: login,
    avatar: avatar_url,
    name
  };
}
