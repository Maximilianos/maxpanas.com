import isEmpty from 'validator/lib/isEmpty';


/**
 * Returns whether the given string is
 * not empty.
 *
 * @param str
 * @returns {boolean}
 */
export default function isNotEmpty(str) {
  return !isEmpty(str);
}
