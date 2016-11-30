import React, {PropTypes} from 'react';

import './Form.scss';

Form.propTypes = {
  onSubmit: PropTypes.func
};
export default function Form(props) {
  return (
    <form
      noValidate
      action=""
      method="post"
      {...props}
      className="form"
    />
  );
}
