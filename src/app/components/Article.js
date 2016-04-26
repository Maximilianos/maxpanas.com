import React, {PropTypes} from 'react';
import Helmet from 'react-helmet';
import Entry from './Entry';
import Error from './Error';

function ArticleError() {
  return (
    <Error code={500} title="Error 500">
      Sorry there was a problem completing this request
    </Error>
  );
}

function NoArticleFound() {
  return (
    <Error code={404} title="Error 404">
      Sorry there is no article at this url
    </Error>
  );
}

function Article({
  isFetching,
  error,
  title,
  description,
  body
}) {
  if (isFetching) {
    return <Entry title="Loading..."/>;
  }

  if (error || !title || !body) {
    return (
      (error.response && error.response.status === 404)
        ? <NoArticleFound />
        : <ArticleError />
    );
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

Article.propTypes = {
  isFetching: PropTypes.bool,
  error: PropTypes.object,
  title: PropTypes.string,
  description: PropTypes.string,
  body: PropTypes.string
};

export default Article;
