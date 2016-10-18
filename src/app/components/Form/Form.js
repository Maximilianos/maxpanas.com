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

  onSubmit = event => {
    event.preventDefault();

    this.setState({wasSubmitted: true});

    debugger;
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
