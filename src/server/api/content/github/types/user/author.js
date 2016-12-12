/**
 * Merge and de-duplicate the author and authors
 * properties into a single array of authors
 *
 * @param author
 * @param authors
 * @returns {[*]}
 */
export function parseAuthors({author, authors}) {
  const authorArr = wordsArray(author);
  const authorsArr = wordsArray(authors);

  // return a de-duped concatenation of the two arrays
  return [...new Set([...authorArr, ...authorsArr])];
}


/**
 * Get an array of words from the given
 * string or array
 *
 * @param words
 * @returns {Array}
 */
function wordsArray(words) {
  try {
    const array = Array.isArray(words)
      ? words : words.split(/\s*,\s*|\s+/);
    return array.map(str => str.trim());
  } catch (error) {
    return [];
  }
}
