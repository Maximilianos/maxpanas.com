import isEmpty from 'validator/lib/isEmpty';
import isEmail from 'validator/lib/isEmail';

function isNotEmpty(str) {
  return !isEmpty(str);
}

async function validateAsync(rules, value) {
  const validationResults = await Promise.all(
    Object.entries(rules).map(([validation, validator]) =>
      Promise.resolve(validator(value)).then(result => ({validation, result}))
    )
  );

  return validationResults
    .reduce(({valid, validations}, {validation, result}) => ({
      value,
      valid: result && valid,
      validations: {
        ...validations,
        [validation]: result
      }
    }), {valid: true});
}

const schema = {
  name: {
    isNotEmpty
  },
  email: {
    isNotEmpty,
    isEmail
  },
  message: {
    isNotEmpty
  }
};

/**
 * Handle submissions to the contact
 * form.
 *
 * @param req
 * @param res
 */
export default async function contactFormHandler(req, res) {
  const formData = req.body;

  const validationData = (await Promise.all(
    Object.entries(schema).map(([field, rules]) =>
      validateAsync(rules, formData[field]).then(validation => ({
        field,
        validation
      }))
    )
  )).reduce(({valid, elements}, {field, validation}) => ({
    valid: valid && validation.valid,
    elements: {
      ...elements,
      [field]: validation,
    }
  }), {valid: true});

  if (!validationData.valid) {
    const errorDetails = Object.entries(validationData.elements)
      .reduce((result, [field, {valid, validations}]) => ({
        ...result,
        [field]: {valid, validations}
      }), {});

    res.status(400).json({
      error: {
        code: 'INVALID',
        summary: 'The data provided was invalid',
        details: errorDetails
      }
    });

    return;
  }

  res.json({
    foo: 'bar'
  });
}
