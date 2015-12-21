import React, {Component, PropTypes} from 'react';
if (process.env.IS_BROWSER) {
  require('../../assets/fonts/black/private/webfonts.css');
  require('normalize.css');
  require('./App.scss');
}

import Header from './elements/Header';

export default class App extends Component {
  static propTypes = {
    children: PropTypes.node,
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
