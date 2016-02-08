import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
import NestedStatus from 'react-nested-status';
import Entry from '../../components/Entry';

import fetch from '../../../utils/redux-universal-fetch/container';
import {fetchArticleIfNeeded} from '../../actions/content';


class Article extends Component {
  static propTypes = {
    content: PropTypes.object
  };

  static renderError({code, title, message}) {
    return (
      <Entry title={title}>
        <NestedStatus code={code}/>
        <Helmet title={title}/>
        {message}
      </Entry>
    );
  }

  static renderGenericError() {
    return Article.renderError({
      code: 500,
      title: 'Error 500',
      message: 'Sorry there was a problem completing this request'
    });
  }

  render() {
    const {content: {
      isFetching,
      data: {title, description, body},
      error
    }} = this.props;

    if (isFetching) return <Entry title="Loading..."/>;

    if (error || !title || !body) {
      if (error.response && error.response.status === 404) {
        return Article.renderError({
          code: 404,
          title: 'Error 404',
          message: 'Sorry there is no article at this url'
        });
      }

      return Article.renderGenericError();
    }

    return (
      <Entry title={title} subtitle={description}>
        <Helmet
          title={title}
          meta={[{name: 'description', content: description}]}
        />
        <div dangerouslySetInnerHTML={{__html: body}}></div>
      </Entry>
    );
  }
}

export default connect(
  ({content}) => ({content})
)(fetch(fetchArticleIfNeeded)(Article));
