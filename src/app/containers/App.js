import React, {Component, PropTypes} from 'react';
import NestedStatus from 'react-nested-status';
import Helmet from 'react-helmet';

import Header from '../components/Header';

import 'normalize.css';
import '../../../assets/fonts/black/private/webfonts.css';
import './App.scss';

import favicon from '../../../assets/favicon/favicon.ico';

export default class App extends Component {
  static propTypes = {
    children: PropTypes.node
  };

  render() {
    return (
      <div>
        <NestedStatus code={200}/>
        <Helmet
          link={[{
            rel: 'shortcut icon',
            href: favicon
          }]}
          meta={[{
            name: 'description',
            content: 'Developer blog'
          }]}
          titleTemplate="%s - Max GJ Panas"
        />
        <Header />
        {this.props.children}
      </div>
    );
  }
}
