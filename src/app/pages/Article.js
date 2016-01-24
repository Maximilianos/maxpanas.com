import React, {Component} from 'react';
import Helmet from 'react-helmet';
import Entry from '../elements/Entry';

export default class Article extends Component {
  render() {
    return (
      <Entry title="Article">
        <Helmet title="Article" />
      </Entry>
    );
  }
}
