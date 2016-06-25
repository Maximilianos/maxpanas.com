import React, {PropTypes} from 'react';
import Helmet from 'react-helmet';
import Entry from '../../Entry/Entry';
import Error from '../../Error/Error';

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
  fetching,
  error,
  title,
  description,
  body
}) {
  if (fetching) {
    return <Entry title="Loading..." />;
  }

  if (error) {
    return (
      (error.response && error.response.status === 404)
        ? <NoArticleFound />
        : <ArticleError />
    );
  }

  return (
    <Entry title={title}>
      <Helmet
        title={title}
        meta={[{name: 'description', content: description}]}
      />
      <div dangerouslySetInnerHTML={{__html: body}} />
    </Entry>
  );
}

Article.propTypes = {
  fetching: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  title: PropTypes.string,
  description: PropTypes.string,
  body: PropTypes.string
};

export default Article;
