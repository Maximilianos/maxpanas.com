import moment from 'moment';


/**
 * Return the number of milliseconds from right now
 * when the cache for the given route should expire
 *
 * @param url
 * @returns {number}
 */
export default function getPageTimeToExpiry(url) {
  // the about page needs to update on my birthday as well as on the
  // the new year to update my age as well as the copyright notice and
  // years of experience referred to in this route
  if (url === '/about') {
    return Math.min(timeToMyBirthday(), timeToNewYear());
  }

  // all pages need to update their cache after the new year in
  // order to update the footer copyright notice and any reference
  // to my years of experience
  return timeToNewYear();
}


/**
 * Return the number of milliseconds from right now
 * until my next birthday
 *
 * @returns {number}
 */
function timeToMyBirthday() {
  const now = moment();

  // if the month is greater than 0 (january) then my birthday is next
  // year. now.month() > 0 is coerced to a number so this works for my
  // use case because my birthday is on the last day of the month.
  const nextBirthday = moment(`${now.year() + (now.month() > 0)}-01-31`);

  return nextBirthday.diff(now);
}


/**
 * Return the number of milliseconds from right now
 * until the next new year
 *
 * @returns {number}
 */
function timeToNewYear() {
  const now = moment();
  const nextNewYear = moment(`${now.year() + 1}-01-01`);
  return nextNewYear.diff(now);
}
