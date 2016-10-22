import nodemailer from 'nodemailer';
import isEmail from 'validator/lib/isEmail';
import isNotEmpty from '../../utils/validator/validators/isNotEmpty';
import validateData from '../../utils/validator/validateData';

import secrets from '../../../secrets.json';

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
  try {
    const formData = req.body;

    const formFields = Object.keys(formData);
    const ruleEntries = Object.entries(schema);

    if (
      formFields.length !== ruleEntries.length
      || !formFields.every(field => schema.hasOwnProperty(field))
    ) {
      res.status(400).json({
        error: {
          code: 'INCORRECT',
          message: 'The submission was missing data or contained invalid fields'
        }
      });

      return;
    }

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

    nodemailer.createTransport({
      service: secrets.mail.service,
      auth: {
        user: secrets.mail.user,
        pass: secrets.mail.pass
      }
    }).sendMail({
      from: formData.email,
      to: secrets.mail.to,
      subject: `maxpanas.com - ${formData.name} has a message for ya!`,
      text: formData.message
    }, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).json({
          error: {
            code: 'MAIL_ERROR',
            summary: 'There was an error sending your email'
          }
        });

        return;
      }

      console.log(info);
      res.json({success: true});
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: {
        code: 'GENERIC_ERROR',
        summary: 'There was an error processing your request'
      }
    });
  }
}
