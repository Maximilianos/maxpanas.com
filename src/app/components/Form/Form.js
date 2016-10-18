import React, {Component, PropTypes} from 'react';

import './Form.scss';

export default class Form extends React.Component {
  static propType = {
    children: PropTypes.func
  };

  constructor() {
    super();

    this.state = {
      wasSubmitted: false
    };
  }

  onSubmit = async event => {
    event.preventDefault();

    this.setState({wasSubmitted: true});

    const validations = Array.from(event.target.elements)
      .filter(element => !!element.name)
      .map(element => element.validateAsync());

    const results = await Promise.all(validations);

    console.log(results.every(result => result === true));
  };

  render() {
    const {children, ...props} = this.props;
    return (
      <form
        noValidate
        className="form"
        onSubmit={this.onSubmit}
        {...props}
      >
        {children({
          wasSubmitted: this.state.wasSubmitted
        })}
      </form>
    );
  }
}