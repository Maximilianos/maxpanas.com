import React, {PropTypes} from 'react';
import Helmet from 'react-helmet';

import Avatar from '../../Avatar/Avatar';
import Loader from '../../Loader/Loader';
import NotFound from '../../Error/NotFound';
import Error from '../../../containers/Error';

import './Article.scss';


Article.propTypes = {
  fetching: PropTypes.bool,
  error: PropTypes.object,
  authors: PropTypes.array,
  published: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  body: PropTypes.string
};
export default function Article({
  fetching,
  error,
  authors,
  published,
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
      <header>
        <h1>
          {title}
        </h1>
        <ul className="article__meta">
          {authors && !!authors.length && (
            <li>Author{authors.length > 1 && 's'}: {authors.map(({username, avatar, name}) => (
              <Avatar
                key={username}
                src={avatar}
                alt={username}
                title={name || username}
                size={25}
              />
            ))}</li>
          )}
          {published && <li>Published: {published}</li>}
        </ul>
      </header>
      <div
        className="article__body"
        dangerouslySetInnerHTML={{__html: body}}
      />
    </article>
  );
}
