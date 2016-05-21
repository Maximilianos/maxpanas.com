import React, {PropTypes} from 'react';

import './Entry.scss';

function Entry({title, subtitle, children}) {
  return (
    <article className="entry">
      <div className="entry__body">
        <h1 className="entry__title">
          {title}
        </h1>
        {subtitle && <h2 className="entry__subtitle">
          {subtitle}
        </h2>}
        {children && <div className="entry__content">
          {children}
        </div>}
      </div>
    </article>
  );
}

Entry.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  children: PropTypes.node,
};

export default Entry;
