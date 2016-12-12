import React, {PropTypes} from 'react';
import {Field} from 'redux-form';

import './BotPot.scss';

BotPot.propTypes = {
  name: PropTypes.string
};
export default function BotPot({name = 'botpot'}) {
  return (
    <div className="bot-pot">
      <label>
        Don't fill this field in, if you are human<br />
        <Field name={name} component="input" />
      </label>
    </div>
  );
}
