import React, {PropTypes} from 'react';
import Helmet from 'react-helmet';
import Entry from '../../Entry/Entry';
import Error from '../../Error/Error';

import './Article.scss';


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


Article.propTypes = {
  fetching: PropTypes.bool,
  error: PropTypes.object,
  title: PropTypes.string,
  description: PropTypes.string,
  body: PropTypes.string
};
export default function Article({
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
    return error.code === 404
      ? <NoArticleFound />
      : <ArticleError />;
  }
  return (
    <article className="article">
      <Helmet
        title={title}
        meta={[{name: 'description', content: description}]}
      />
      <header className="article__header">
        <h1 className="article__title">
          {title}
        </h1>
      </header>
      <div
        className="article__body"
        dangerouslySetInnerHTML={{__html: body}}
      />
    </article>
  );
}
