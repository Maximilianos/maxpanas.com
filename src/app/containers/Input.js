import {createElement, Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import validateValue from '../../utils/validator/validateValue';

import {
  inputBlur,
  inputFocus,
  inputChange,
  inputValidity
} from '../redux/forms/actions';

import {getInput} from '../redux/forms/reducer';

import Input from '../components/Form/Input/Input';


function validateAsync(validators, value) {
  if (typeof validators === 'function') {
    const validation = validators.name || 'isValid';
    validators = {[validation]: validators};
  }

  return validateValue(validators, value);
}


const mapStateToProps = form => (state, {name}) => {
  const {focused, value, valid, validations} = getInput(state, form, name);
  return {
    name,
    focused,
    value,
    valid,
    validations
  };
};


const mapDispatchToProps = form => (dispatch, {name, validators}) => {
  return {
    name,
    onFocus: () => dispatch(inputFocus(form, name)),
    onChange,
    onBlur: () => dispatch(inputBlur(form, name))
  };

  async function onChange({target: {value}}) {
    dispatch(inputChange(form, name, value));

    const {valid, validations} = await validateAsync(
      validators,
      value
    );

    dispatch(inputValidity(form, name, valid, validations));
  }
};


class InputProvider extends Component {
  static contextTypes = {
    form: PropTypes.string.isRequired
  };

  render() {
    const {form} = this.context;
    return createElement(connect(
      mapStateToProps(form),
      mapDispatchToProps(form)
    )(Input), this.props);
  }
}


export default connect(
  null, null
)(InputProvider);
