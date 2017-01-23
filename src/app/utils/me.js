/**
 * Returns my years of age
 *
 * @returns {number}
 */
export function myAge() {
  const today = new Date();
  const birthDate = new Date(1988, 0, 31);
  const yearsDiff = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  return (m < 0 || (m === 0 && today.getDate() < birthDate.getDate()))
    ? yearsDiff - 1
    : yearsDiff;
}


/**
 * Returns my years of experience as a word rather than number.
 * Starts at 6 because I had six years experience when I wrote
 * this first time. Maxes out at 10 because that's in a long
 * time.
 *
 * @returns {String}
 */
export function myYearsExperienceInWords() {
  const experience = (new Date()).getFullYear() - 2010;
  const words = {
    6: 'six', 7: 'seven', 8: 'eight',
    9: 'nine', 10: 'ten', 11: 'over ten'
  };

  return words[experience] || words[11];
}
