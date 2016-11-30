/**
 * Determine if thing is a non empty Object
 *
 * @param thing
 * @returns {boolean}
 */
export default function isNonEmptyObject(thing) {
  return thing.constructor === Object && Object.keys(thing).length > 0;
}
