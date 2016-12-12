/**
 * Validate a value against a chain of
 * potentially asynchronous validation
 * functions.
 *
 * @param value string
 * @param rules object
 * @returns {*}
 */
export default async function validateValue(rules, value) {
  const validations = Object.entries(rules).map(async ([validation, validator]) => ({
    validation,
    result: await validator(value)
  }));

  const results = await Promise.all(validations);

  return results.reduce(({valid, validations}, {validation, result}) => ({
    value,
    valid: result && valid,
    validations: {
      ...validations,
      [validation]: result
    }
  }), {
    value,
    valid: true,
    validations: {}
  });
}
