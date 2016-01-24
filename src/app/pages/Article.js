import React, {Component, PropTypes} from 'react';
import Helmet from 'react-helmet';
import {Base64} from 'js-base64';
import marked from 'marked';
import Entry from '../elements/Entry';

export default class Article extends Component {
  static propTypes = {
    params: PropTypes.object
  };

  constructor() {
    super();
    this.state = {
      content: ''
    };

    this.fetchArticle = this.fetchArticle.bind(this);
  }

  componentDidMount() {
    this.fetchArticle(this.props.params.article);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.params.article !== this.props.params.article) {
      this.fetchArticle(this.props.params.article);
    }
  }

  componentWillUnmount() {
    this.ignoreLastFetch = true;
  }

  fetchArticle(article) {
    fetch(`https://api.github.com/repos/Maximilianos/articles/contents/articles/${article}.md`, {
      headers: {Accept: 'application/vnd.github.v3+json'}
    }).then(res => {
      if (res.status >= 200 && res.status < 300) return res;
      const error = new Error(res.statusText);
      error.response = res;
      throw error;
    }).then(response => response.json())
      .then(json => ({...json, content: Base64.decode(json.content)}))
      .then(json => ({...json, content: marked(json.content)}))
      .then(({content}) => !this.ignoreLastFetch && this.setState({content}))
      .catch(err => !this.ignoreLastFetch && this.setState({content: err.toString()}));
  }

  render() {
    return (
      <Entry>
        <Helmet title={`Article - ${this.props.params.article}`} />
        <div dangerouslySetInnerHTML={{__html: this.state.content}}></div>
      </Entry>
    );
  }
}
