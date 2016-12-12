/**
 * Extract and normalize the results of asynchronous
 * validations
 *
 * @param validations
 * @returns {*}
 */
export default async function getValidationResults(validations) {
  const results = await Promise.all(validations);

  return results.reduce(({valid, elements}, {field, result}) => ({
    valid: valid && result.valid,
    elements: {
      ...elements,
      [field]: result
    }
  }), {valid: true});
}
