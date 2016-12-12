import nodemailer from 'nodemailer';
import isEmail from 'validator/lib/isEmail';
import isNotEmpty from './validator/validators/isNotEmpty';
import validateData from './validator/validateData';

import secrets from './secrets.json';


const errors = {
  invalid: {
    code: 'INVALID',
    summary: 'The data provided was invalid.'
  },
  mail: {
    code: 'MAIL_ERROR',
    summary: 'There was an error sending your email, please try again.'
  },
  generic: {
    code: 'GENERIC_ERROR',
    summary: 'There was an error processing your request.'
  }
};


const schema = {
  name: {isNotEmpty},
  email: {isNotEmpty, isEmail},
  message: {isNotEmpty}
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
        error: errors.invalid
      });
      return;
    }

    const validationResult = await validateData(schema, formData);
    if (!validationResult.valid) {
      res.status(400).json({
        error: errors.invalid
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
    }, (error) => {
      if (error) {
        res.status(500).json({
          error: errors.mail
        });
        return;
      }

      res.json({
        success: true
      });
    });

  } catch (error) {
    res.status(500).json({
      error: errors.generic
    });
  }
}
