import React, {PropTypes} from 'react';

import './Entry.scss';


Entry.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  children: PropTypes.node,
};
export default function Entry({title, subtitle, children}) {
  return (
    <article className="entry">
      <header className="entry__header">
        <h1 className="entry__title">
          {title}
        </h1>
        {subtitle && <h2 className="entry__subtitle">
          {subtitle}
        </h2>}
      </header>
      {children && <div className="entry__content">
        {children}
      </div>}
    </article>
  );
}
