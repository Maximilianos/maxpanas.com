import React, {PropTypes} from 'react';
import omit from 'object.omit';

import './Input.scss';

function NativeInput(props) {
  return <input {...props} />;
}

function NativeTextarea(props) {
  const textareaProps = omit(props, 'type');
  return <textarea {...textareaProps} />;
}

Input.propTypes = {
  size: PropTypes.string,
  type: PropTypes.string,
  showError: PropTypes.bool,
  label: PropTypes.string,
  input: PropTypes.shape({
    value: PropTypes.string,
    onFocus: PropTypes.func,
    onChange: PropTypes.func,
    onBlur: PropTypes.func
  }),
  meta: PropTypes.shape({
    active: PropTypes.bool,
    error: PropTypes.string
  })
};
export default function Input({
  size = 'full',
  type = 'text',
  showError = true,
  label,
  input: {
    value = '',
    onFocus,
    onChange,
    onBlur,
  },
  meta: {
    active = false,
    error
  },
  ...props
}) {
  const FieldEl = type === 'textarea'
    ? NativeTextarea
    : NativeInput;

  let classNames = 'input';
  if (error && showError) classNames += ' input--invalid';
  if (active) classNames += ' input--focused';
  if (value === '') classNames += ' input--empty';
  if (size === 'half') classNames += ' input--half';

  return (
    <label className={classNames}>
      {label && (
        <span className="input__label">
          {label}
        </span>
      )}
      <FieldEl
        {...props}
        className="input__field"
        type={type}
        value={value}
        onFocus={onFocus}
        onChange={onChange}
        onBlur={onBlur}
      />
      {error && showError && (
        <span className="input__error">
          {error}
        </span>
      )}
    </label>
  );
}
