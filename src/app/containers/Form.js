import {createElement, Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import fetch from 'isomorphic-fetch';

import {
  submissionStart,
  submissionSuccess,
  submissionFailure
} from '../redux/forms/actions';

import getValidationResults from '../../utils/validator/getValidationResults';

import Form from '../components/Form/Form';

const mapDispatchToProps = formName => (dispatch, {method, action}) => ({
  onSubmit: async event => {
    event.preventDefault();

    dispatch(submissionStart(formName));

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
        dispatch(submissionFailure({
          form: formName,
          error: 'VALIDATION',
          details: elements
        }));
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
        dispatch(submissionFailure({
          form: formName,
          error: 'SERVER',
          details: json.error
        }));
        return;
      }

      dispatch(submissionSuccess(formName));
    } catch ({name, message}) {
      dispatch(submissionFailure({
        form: formName,
        error: 'GENERIC',
        details: {name, message}
      }));
    }
  }
});

export default class FormProvider extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired
  };

  static childContextTypes = {
    form: PropTypes.string.isRequired
  };

  getChildContext() {
    return {form: this.props.name};
  }

  render() {
    const {name, ...props} = this.props;
    return createElement(connect(
      null, mapDispatchToProps(name)
    )(Form), props);
  }
}
