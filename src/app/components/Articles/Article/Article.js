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
    return (
      <div className="article">
        <h1 className="article__loader">
          <Loader />
          Loading
          <Loader />
        </h1>
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
      <h1>
        {title}
      </h1>
      <div dangerouslySetInnerHTML={{__html: body}} />
    </article>
  );
}
