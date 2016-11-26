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
  type: PropTypes.string,
  value: PropTypes.string,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  size: PropTypes.oneOf(['full', 'half']),
  label: PropTypes.string,
  focused: PropTypes.bool,
  valid: PropTypes.bool,
  validations: PropTypes.objectOf(PropTypes.bool),
  errorMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  onMount: PropTypes.func,
  onFocus: PropTypes.func,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
};
export default function Input({
  type = 'text',
  value = '',
  focused = false,
  label = false,
  size = 'full',
  valid,
  validations,
  errorMessage,
  onFocus,
  onChange,
  onBlur,
  ...props
}) {
  const error = valid === false && (
      typeof errorMessage === 'function'
        ? errorMessage(validations)
        : errorMessage
    );

  const FieldEl = type === 'textarea'
    ? NativeTextarea
    : NativeInput;

  let classNames = 'input';
  if (error) classNames += ' input--invalid';
  if (focused) classNames += ' input--focused';
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
      {error && (
        <span className="input__error">
          {error}
        </span>
      )}
    </label>
  );
}
