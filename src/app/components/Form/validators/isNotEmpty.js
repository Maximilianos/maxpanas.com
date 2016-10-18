import isEmpty from 'validator/lib/isEmpty';

/**
 *
 *
 * @param value
 * @returns {boolean}
 */
export default function isNotEmpty(value) {
  return !isEmpty(value);
}
