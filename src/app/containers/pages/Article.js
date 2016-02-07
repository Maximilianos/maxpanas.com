import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
import Entry from '../../components/Entry';

import fetch from '../../../utils/redux-universal-fetch/container';
import {fetchArticleIfNeeded} from '../../actions/content';


class Article extends Component {
  static propTypes = {
    content: PropTypes.object
  };

  render() {
    const {content: {isFetching, data: {title, description, body}, error}} = this.props;

    if (isFetching) return <Entry title="Loading..."/>;
    if (error || !title || !body) return <Entry title="Error">Sorry</Entry>;

    return (
      <Entry
        title={title}
        subtitle={description}
      >
        <Helmet title={title}/>
        <div dangerouslySetInnerHTML={{__html: body}}></div>
      </Entry>
    );
  }
}

export default connect(
  ({content}) => ({content})
)(fetch(fetchArticleIfNeeded)(Article));
