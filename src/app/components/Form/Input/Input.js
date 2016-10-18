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

  validateAsync = value => {
    let {validators, errorMessage} = this.props;
    if (!validators) {
      return;
    }

    if (typeof validators === 'function') {
      validators = {validator: validators};
    }

    Promise
      .all(Object.values(validators).map(validator => validator(value)))
      .then(validations => {
        const valid = validations.every(result => result);

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
      });
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

  componentDidUpdate() {
    this.refs.inputElement.dataset.valid = !this.state.error;
  }

  setInputRef = input => {
    debugger;
    this.refs.inputElement = input;
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
      <label className={classNames}>
        {label && (
          <span className="input__label">
            {label}
          </span>
        )}
        <FieldEl
          type={type}
          value={value}
          className="input__field"
          ref="inputElement"
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
