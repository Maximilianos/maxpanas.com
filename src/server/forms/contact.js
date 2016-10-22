import isEmail from 'validator/lib/isEmail';
import isNotEmpty from '../../utils/validator/validators/isNotEmpty';
import validateData from '../../utils/validator/validateData';

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

  const validationResult = await validateData(schema, formData);

  if (!validationResult.valid) {
    const errorDetails = Object.entries(validationResult.elements)
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
