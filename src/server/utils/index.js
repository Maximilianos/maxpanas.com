/**
 * Utility to concat and de-duplicate a list of arrays
 *
 * @param arrays
 * @returns {string|*|Array.<T>|Buffer}
 */
export function union(...arrays) {
  return arrays.reduce((union, array) =>
    union.concat(array.filter(
      item => !union.includes(item)
    ))
  );
}


/**
 * Utility predicate for a filtering out duplicates
 * in an existing array
 *
 * @param item
 * @param index
 * @param arr
 * @returns {boolean}
 */
export function unique(item, index, arr) {
  return arr.indexOf(item) === index;
}
