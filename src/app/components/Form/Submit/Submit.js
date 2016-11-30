import React, {PropTypes} from 'react';

import Loader from '../../Loader/Loader';

import './Submit.scss';


Submit.propTypes = {
  submitting: PropTypes.bool,
  submitFailed: PropTypes.bool,
  formMessage: PropTypes.string
};
export default function Submit({submitting, submitFailed, formMessage}) {
  let classNames = 'submit';
  if (submitFailed) classNames += ' submit--error';
  if (submitting) classNames += ' submit--sending';

  return (
    <div className={classNames}>
      <button className="submit__button" disabled={submitting}>
        {submitting ? 'Sending' : 'Send'} Message
      </button>
      <div className="submit__message">
        {(submitting && <Loader />) || formMessage}
      </div>
    </div>
  );
}
