import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import NestedStatus from 'react-nested-status';
import Helmet from 'react-helmet';

import './Error.scss';

Error.propTypes = {
  code: PropTypes.number,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  message: PropTypes.string
};
export default function Error({
  code = 500,
  title = '500',
  subtitle = 'Error',
  message = 'The server had a problem completing your request',
}) {
  return (
    <article className="error">
      <NestedStatus code={code} />
      <Helmet
        title={`${title} ${subtitle}`}
        meta={[{
          name: 'description',
          content: message
        }]}
      />
      <h1 className="error__title">
        {title}
        <span className="error__subtitle">
          &nbsp;{subtitle}
        </span>
      </h1>
      <p className="error__message">
        {message}
      </p>
      <ul className="error__links">
        <li>
          <Link to="/">
            Go Home
          </Link>
        </li>
      </ul>
    </article>
  );
}
