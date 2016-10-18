import React, {Component, PropTypes} from 'react';

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

  static NativeTextarea({type, ...props}) {
    return <textarea {...props} />;
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

  validateAsync = async value => {
    let {validators, errorMessage} = this.props;
    if (!validators) {
      return Promise.resolve(true);
    }

    if (typeof validators === 'function') {
      validators = {validator: validators};
    }

    const validations = await Promise.all(
      Object.values(validators).map(validator => validator(value))
    );

    const valid = validations.every(result => result === true);

    let error = !valid && errorMessage;
    if (error && typeof errorMessage === 'function') {
      const errors = Object.keys(validators)
        .reduce((results, validation, index) => ({
          ...results,
          [validation]: !validations[index]
        }), {});

      error = errorMessage(errors);
    }

    this.setState({
      error,
      wasInvalid: this.state.wasInvalid || !valid,
    });

    return valid;
  };

  onInputChange = event => {
    const value = event.target.value;

    this.setState({value});

    if (this.props.validate && this.state.wasInvalid) {
      this.validateAsync(value);
    }
  };

  onInputFocus = () => this.setState({focused: true});
  onInputBlur = event => {
    this.setState({focused: false});

    if (this.props.validate) {
      this.validateAsync(event.target.value);
    }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.validate && !this.props.validate) {
      this.validateAsync(this.state.value);
    }
  }

  componentDidMount = this.exposeValidate;
  componentDidUpdate = this.exposeValidate;

  exposeValidate = () => {
    this.inputElement.validateAsync = this.validateAsync.bind(this, this.state.value);
  };

  setInputRef = label => {
    this.inputElement = label && label.control;
  };

  render() {
    const {size, type, label, validate, validators, errorMessages, ...props} = this.props;
    const {focused, value, error} = this.state;

    let classNames = 'input';
    if (error) classNames += ' input--invalid';
    if (focused) classNames += ' input--focused';
    if (value === '') classNames += ' input--empty';
    if (size === 'half') classNames += ' input--half';

    const FieldEl = type === 'textarea'
      ? Input.NativeTextarea
      : Input.NativeInput;

    return (
      <label className={classNames} ref={this.setInputRef}>
        {label && (
          <span className="input__label">
            {label}
          </span>
        )}
        <FieldEl
          type={type}
          value={value}
          className="input__field"
          onFocus={this.onInputFocus}
          onChange={this.onInputChange}
          onBlur={this.onInputBlur}
          {...props}
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
