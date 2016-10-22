import React, {Component, PropTypes} from 'react';

import getValidationResults from '../../../utils/validator/getValidationResults';

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

      const validations = inputs.map(async ({name, validateAsync}) => ({
        field: name,
        result: await validateAsync()
      }));

      onSubmit(event, {
        form,
        inputs,
        formState: await getValidationResults(validations)
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
