import React, {Component, PropTypes} from 'react';

export default class App extends Component {
  static propTypes = {
    children: PropTypes.object,
  };

  render() {
    return (
      <div>
        <h1>MaxPanas.com</h1>
        {this.props.children}
      </div>
    );
  }
}
