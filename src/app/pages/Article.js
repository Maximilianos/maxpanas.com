import React, {Component, PropTypes} from 'react';
import Helmet from 'react-helmet';
import {Base64} from 'js-base64';
import frontMatter from 'front-matter';
import marked from 'marked';
import Entry from '../elements/Entry';

export default class Article extends Component {
  static propTypes = {
    params: PropTypes.object
  };

  constructor() {
    super();
    this.state = {
      title: '',
      description: '',
      body: ''
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
      .then(json => Base64.decode(json.content))
      .then(content => frontMatter(content))
      .then(({attributes: {title, description}, body}) => ({title, description, body: marked(body)}))
      .then(json => !this.ignoreLastFetch && this.setState(json))
      .catch(err => !this.ignoreLastFetch && this.setState({body: err.toString()}));
  }

  render() {
    const {title, description, body} = this.state;
    return (
      <Entry>
        <Helmet title={`Article - ${title}`} meta={[{name: 'description', content: description}]} />
        <div dangerouslySetInnerHTML={{__html: body}}></div>
      </Entry>
    );
  }
}
