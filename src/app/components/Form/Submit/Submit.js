import React, {PropTypes} from 'react';

import Loader from '../../Loader/Loader';

import './Submit.scss';


Submit.propTypes = {
  sending: PropTypes.bool,
  error: PropTypes.bool,
  message: PropTypes.string
};
export default function Submit({sending, error, message}) {
  let classNames = 'submit';
  if (error) classNames += ' submit--error';
  if (sending) classNames += ' submit--sending';

  return (
    <div className={classNames}>
      <button className="submit__button" disabled={sending}>
        {sending ? 'Sending' : 'Send'} Message
      </button>
      <div className="submit__message">
        {(sending && <Loader />) || message}
      </div>
    </div>
  );
}
