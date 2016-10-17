import React, {Component, PropTypes} from 'react';

import './Input.scss';

function NativeInput(props) {
  return <input {...props} />;
}

function Textarea({type, ...props}) {
  return <textarea {...props} />;
}

export default class Input extends Component {
  static propTypes = {
    size: PropTypes.oneOf(['full', 'half']),
    type: PropTypes.string,
    label: PropTypes.string
  };

  static defaultProps = {
    type: 'text'
  };

  constructor() {
    super();

    this.state = {
      focused: false,
      value: ''
    };
  }

  onInputBlur = () => this.setState({focused: false});
  onInputFocus = () => this.setState({focused: true});
  onInputChange = event => this.setState({value: event.target.value});

  render() {
    const {size, type, label, ...props} = this.props;
    const {focused, value} = this.state;

    let classNames = 'input';
    if (focused) classNames += ' input--focused';
    if (value === '') classNames += ' input--empty';
    if (size === 'half') classNames += ' input--half';

    const FieldEl = type === 'textarea' ? Textarea : NativeInput;

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
          onFocus={this.onInputFocus}
          onBlur={this.onInputBlur}
          onChange={this.onInputChange}
          {...props}
        />
      </label>
    );
  }
}
