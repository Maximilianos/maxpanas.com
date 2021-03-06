import nodemailer from 'nodemailer';
import mailgunTransport from 'nodemailer-mailgun-transport';
import isEmail from 'validator/lib/isEmail';
import isNotEmpty from './validator/validators/isNotEmpty';
import validateData from './validator/validateData';

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

    const emailTransport = nodemailer.createTransport(mailgunTransport({
      auth: {
        api_key: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN
      }
    }));

    emailTransport.sendMail({
      from: formData.email,
      to: process.env.CONTACT_EMAIL,
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
