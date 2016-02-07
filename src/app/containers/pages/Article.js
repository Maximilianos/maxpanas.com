import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import fetch from '../../../utils/redux-universal-fetch/container';
import {fetchContentIfNeeded} from '../../actions/content';

import Entry from '../../components/Entry';


class Article extends Component {
  static propTypes = {
    content: PropTypes.object
  };

  render() {
    const {content} = this.props;

    return (
      <Entry>
        <pre>
          {JSON.stringify(content, null, 2)}
        </pre>
      </Entry>
    );
  }
}

export default connect(
  ({content}) => ({content})
)(fetch(fetchContentIfNeeded)(Article));
