import React, {PropTypes} from 'react';
import {withRouter, Link} from 'react-router';
import NestedStatus from 'react-nested-status';
import Helmet from 'react-helmet';

import './Error.scss';

Error.propTypes = {
  code: PropTypes.number,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  message: PropTypes.string,
  router: PropTypes.node
};
export default withRouter(function Error({
  code = 500,
  title = '500',
  subtitle = 'Error',
  message = 'There was a problem completing your request',
  router
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
          {subtitle}
        </span>
      </h1>
      <p className="error__message">
        {message}
      </p>
      <ul className="error__links">
        {!!(global.history && global.history.length) && <li>
          <button
            className="error__back-button"
            onClick={router.goBack}
          >
            Go Back
          </button>
        </li>}
        <li>
          <Link to="/">
            Go Home
          </Link>
        </li>
      </ul>
    </article>
  );
});
