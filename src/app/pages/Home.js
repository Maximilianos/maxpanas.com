import React, {Component} from 'react';
import Helmet from 'react-helmet';
import Entry from '../elements/Entry';

export default class Home extends Component {
  render() {
    return (
      <Entry title="Welcome to my Website!">
        <Helmet title="Home" />
      </Entry>
    );
  }
}
