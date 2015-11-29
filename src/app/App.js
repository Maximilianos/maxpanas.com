import React, {Component, PropTypes} from 'react';

import Header from './elements/Header';

export default class App extends Component {
  static propTypes = {
    children: PropTypes.object,
  };

  render() {
    return (
      <div>
        <Header />
        {this.props.children}
      </div>
    );
  }
}
