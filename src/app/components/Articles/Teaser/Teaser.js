import React, {PropTypes} from 'react';
import {Link} from 'react-router';

import './Teaser.scss';


Teaser.propTypes = {
  fetching: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  article: PropTypes.string,
  title: PropTypes.string,
  excerpt: PropTypes.string
};
export default function Teaser({fetching, error, article, title, excerpt}) {
  return error || fetching ? null : (
    <article className="teaser">
      <Link className="teaser__link" to={article}>
        <h2 className="teaser__title">
          {title}
        </h2>
        {excerpt && <div className="teaser__excerpt">
          {excerpt}
        </div>}
      </Link>
    </article>
  );
}
