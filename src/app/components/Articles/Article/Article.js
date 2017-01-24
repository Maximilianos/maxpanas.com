import React, {PropTypes} from 'react';
import Helmet from 'react-helmet';

import Avatar from '../../Avatar/Avatar';
import Loader from '../../Loader/Loader';
import NotFound from '../../Error/NotFound';
import Error from '../../Error/Error';

import './Article.scss';

const AuthorInterface = {
  username: PropTypes.string,
  avatar: PropTypes.string,
  name: PropTypes.string
};

const AuthorsInterface = PropTypes.arrayOf(
  PropTypes.shape(AuthorInterface)
);

Article.propTypes = {
  fetching: PropTypes.bool,
  error: PropTypes.object,
  authors: AuthorsInterface,
  contributors: AuthorsInterface,
  published: PropTypes.string,
  latestUpdate: PropTypes.shape({
    date: PropTypes.string,
    message: PropTypes.string
  }),
  title: PropTypes.string,
  description: PropTypes.string,
  body: PropTypes.string
};
export default function Article({
  fetching,
  error,
  authors,
  contributors,
  published,
  latestUpdate,
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
            <li>Author{authors.length > 1 && 's'}:&nbsp;
              {authors.map(({username, avatar, name}) => (
                <Avatar
                  key={username}
                  className="article__avatar"
                  src={avatar}
                  alt={username}
                  title={name || username}
                  size={23}
                />
              ))}
            </li>
          )}
          {contributors && !!contributors.length && (
            <li>Contributor{authors.length > 1 && 's'}:&nbsp;
              {contributors.map(({username, avatar, name}) => (
                <Avatar
                  key={username}
                  className="article__avatar"
                  src={avatar}
                  alt={username}
                  title={name || username}
                  size={23}
                />
              ))}
            </li>
          )}
          {published && <li>Published: {published}</li>}
          {latestUpdate && (
            <li>
              Updated:&nbsp;
              <span title={latestUpdate.message}>
                {latestUpdate.date}
              </span>
            </li>
          )}
        </ul>
      </header>
      <div
        className="article__body"
        dangerouslySetInnerHTML={{__html: body}}
      />
    </article>
  );
}
