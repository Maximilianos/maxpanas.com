import React, {PropTypes} from 'react';

import './Form.scss';

Form.propTypes = {
  method: PropTypes.string,
  action: PropTypes.string,
  onSubmit: PropTypes.func
};
export default function Form(props) {
  return (
    <form
      {...props}
      className="form"
    />
  );
}
