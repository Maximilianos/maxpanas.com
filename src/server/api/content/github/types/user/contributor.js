/**
 * Extract contributor data from the given list
 * of all updates
 *
 * @param allUpdates
 * @returns {*}
 */
export function getContributorData(allUpdates) {
  return allUpdates
    .map(({commit: {author: {name}}, author: {login, avatar_url}}) => ({
      username: login, avatar: avatar_url, name
    }))
    .reduce(aggregateContributions, []);
}


/**
 * Count the contributions for each contributor
 *
 * @param contributors
 * @param username
 * @param avatar
 * @param name
 * @param contributions
 * @returns {array}
 */
function aggregateContributions(contributors, {username, avatar, name, contributions = 1}) {
  const indexOfExisting = contributors.findIndex(
    contributor => contributor.username === username
  );

  if (indexOfExisting >= 0) {
    contributors[indexOfExisting] = {
      ...contributors[indexOfExisting],
      contributions: contributors[indexOfExisting].contributions + contributions
    };

    return contributors;
  }

  return contributors.concat({
    username, avatar, name,
    contributions,
  });
}
