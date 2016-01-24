import React, {Component, PropTypes} from 'react';

import 'normalize.css';
import '../../assets/fonts/black/private/webfonts.css';
import './App.scss';

import Header from './elements/Header';

export default class App extends Component {
  static propTypes = {
    children: PropTypes.node
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
