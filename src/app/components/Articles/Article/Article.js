import React, {PropTypes} from 'react';
import Helmet from 'react-helmet';

import Loader from '../../Loader/Loader';
import NotFound from '../../Error/NotFound';
import Error from '../../../containers/Error';

import './Article.scss';


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
    // TODO: find a better loader
    return (
      <div className="article">
        <h1>Loading <Loader /></h1>
      </div>
    );
  }

  if (error) {
    return error.code === 404
      ? <NotFound />
      : <Error />;
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
