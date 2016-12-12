import validateValue from './validateValue';
import getValidationResults from './getValidationResults';


/**
 * Validate a data object against a schema
 * of validation rules that is given
 *
 * @param schema
 * @param data
 * @returns {*}
 */
export default async function validateData(schema, data) {
  const validations = Object.entries(schema).map(async ([field, rules]) => ({
    field,
    result: await validateValue(rules, data[field])
  }));

  return await getValidationResults(validations);
}
