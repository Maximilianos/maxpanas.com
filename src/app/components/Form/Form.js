import React, {Component, PropTypes} from 'react';

import './Form.scss';

export default class Form extends Component {
  static propTypes = {
    children: PropTypes.func,
    onSubmit: PropTypes.func
  };

  constructor() {
    super();

    this.state = {
      wasSubmitted: false
    };
  }

  onSubmit = async event => {
    this.setState({wasSubmitted: true});

    const {onSubmit} = this.props;
    if (typeof onSubmit === 'function') {
      event.preventDefault();

      const form = event.target;
      const inputs = Array.from(form.elements)
        .filter(input => typeof input.validateAsync === 'function');

      const validations = (await Promise.all(inputs.map(
        input => input.validateAsync().then(result => ({
          name: input.name,
          result
        }))
      ))).reduce(({valid, details}, {name, result}) => ({
        valid: result.valid && valid,
        details: {
          ...details,
          [name]: result
        }
      }), {valid: true});

      onSubmit(event, {
        form,
        inputs,
        validation
      });
    }
  };

  render() {
    const {children, ...props} = this.props;
    return (
      <form
        {...props}
        className="form"
        onSubmit={this.onSubmit}
      >
        {children({
          wasSubmitted: this.state.wasSubmitted
        })}
      </form>
    );
  }
}
