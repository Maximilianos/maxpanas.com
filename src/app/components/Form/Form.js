import React, {Component, PropTypes} from 'react';

import getValidationResults from '../../../utils/validator/getValidationResults';

import './Form.scss';

export default class Form extends Component {
  static propTypes = {
    children: PropTypes.node,
    onSubmit: PropTypes.func
  };

  onSubmit = async event => {
    if (typeof this.props.onSubmit !== 'function') {
      return;
    }

    const form = event.target;

    const inputs = Array.from(form.elements)
      .filter(input => typeof input.validateAsync === 'function');

    this.props.onSubmit(event, {
      form,
      inputs,
      async getFormState() {
        const validations = inputs.map(async ({name, validateAsync}) => ({
          field: name,
          result: await validateAsync()
        }));

        return await getValidationResults(validations);
      }
    });
  };

  render() {
    const {children, ...props} = this.props;
    return (
      <form
        {...props}
        className="form"
        onSubmit={this.onSubmit}
      >
        {children}
      </form>
    );
  }
}
