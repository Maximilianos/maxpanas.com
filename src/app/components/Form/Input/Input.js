import React, {Component, PropTypes} from 'react';
import omit from 'object.omit';

import validateValue from '../../../../utils/validator/validateValue';

import './Input.scss';


export default class Input extends Component {
  static propTypes = {
    size: PropTypes.oneOf(['full', 'half']),
    type: PropTypes.string,
    label: PropTypes.string,
    validate: PropTypes.bool,
    validators: PropTypes.oneOfType([PropTypes.func, PropTypes.objectOf(PropTypes.func)]),
    errorMessage: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
  };

  static defaultProps = {
    size: 'full',
    type: 'text',
    validate: true
  };

  static NativeInput(props) {
    return <input {...props} />;
  }

  static NativeTextarea(props) {
    const textareaProps = omit(props, 'type');
    return <textarea {...textareaProps} />;
  }

  constructor() {
    super();

    this.state = {
      focused: false,
      value: '',
      error: false,
      wasInvalid: false
    };
  }

  validateAsync = async (value = this.state.value) => {
    let {validators} = this.props;
    if (!validators) {
      return {valid: true};
    }

    if (typeof validators === 'function') {
      const validation = validators.name || 'valid';
      validators = {[validation]: validators};
    }

    const validations = await validateValue(validators, value);

    this.setState({
      wasInvalid: this.state.wasInvalid || !validations.valid,
    });

    this.setErrorMessage(validations);

    return validations;
  };

  setErrorMessage({valid, validations}) {
    const {errorMessage} = this.props;
    const error = !valid && (
        typeof errorMessage === 'function'
          ? errorMessage(validations)
          : errorMessage
      );

    this.setState({error});
  }

  onInputChange = event => {
    const {value} = event.target;

    this.setState({value});

    if (this.props.validate && this.state.wasInvalid) {
      this.validateAsync(value);
    }
  };

  onInputFocus = () => this.setState({focused: true});
  onInputBlur = () => {
    this.setState({focused: false});

    if (this.props.validate) {
      this.validateAsync();
    }
  };

  exposeValidateAsync = label => {
    if (label) {
      label.control.validateAsync = this.validateAsync.bind(this, undefined);
    }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.validate && !this.props.validate) {
      this.validateAsync(this.state.value);
    }
  }

  render() {
    const {size, type, label, ...props} = this.props;
    const {focused, value, error} = this.state;

    let classNames = 'input';
    if (error) classNames += ' input--invalid';
    if (focused) classNames += ' input--focused';
    if (value === '') classNames += ' input--empty';
    if (size === 'half') classNames += ' input--half';

    const FieldEl = type === 'textarea'
      ? Input.NativeTextarea
      : Input.NativeInput;

    const extraInputProps = omit(props, [
      'validate', 'validators', 'errorMessages'
    ]);

    return (
      <label
        className={classNames}
        ref={this.exposeValidateAsync}
      >
        {label && (
          <span className="input__label">
            {label}
          </span>
        )}
        <FieldEl
          {...extraInputProps}
          type={type}
          value={value}
          className="input__field"
          onFocus={this.onInputFocus}
          onChange={this.onInputChange}
          onBlur={this.onInputBlur}
        />
        {error && (
          <span className="input__error">
            {error}
          </span>
        )}
      </label>
    );
  }
}
