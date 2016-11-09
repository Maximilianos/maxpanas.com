import React, {Component, PropTypes} from 'react';
import fetch from 'isomorphic-fetch';

import getValidationResults from '../../../utils/validator/getValidationResults';

import './Form.scss';

export default class Form extends Component {
  static propTypes = {
    method: PropTypes.string,
    action: PropTypes.string,
    children: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      submittedOnce: false,
      sending: false,
      error: false,
      message: ''
    };
  }

  onSubmit = async event => {
    const {method, action} = this.props;

    event.preventDefault();

    this.setState({
      submittedOnce: true,
      sending: true,
      error: false,
      message: ''
    });

    const form = event.target;

    const inputs = Array.from(form.elements)
      .filter(input => typeof input.validateAsync === 'function');

    try {
      const validations = inputs.map(async ({name, validateAsync}) => ({
        field: name,
        result: await validateAsync()
      }));

      const {valid, elements} = await getValidationResults(validations);

      if (!valid) {
        this.setState({
          sending: false,
          error: true,
          message: 'Please, correctly fill in the form.'
        });
        return;
      }

      const formData = Object.entries(elements)
        .reduce((data, [field, {value}]) => ({...data, [field]: value}), {});

      const response = await fetch(action, {
        method,
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify(formData)
      });

      const json = await response.json();

      if (json.error) {
        this.setState({
          sending: false,
          error: true,
          message: json.error.summary
        });
        return;
      }

      // TODO: figure out a declarative way of doing this.
      inputs.forEach(input => input.reset());

      this.setState({
        sending: false,
        message: '✓ Your message was sent! Thank you for your message!'
      });

    } catch (error) {
      this.setState({
        sending: false,
        error: true,
        message: 'There was a problem submitting your form. Please, try again.'
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
        {children({...this.state})}
      </form>
    );
  }
}
