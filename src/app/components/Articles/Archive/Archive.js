import React, {PropTypes} from 'react';
import Teaser from '../../../containers/Teaser';

import './Archive.scss';


Archive.propTypes = {
  fetching: PropTypes.bool,
  error: PropTypes.object,
  title: PropTypes.string,
  archive: PropTypes.arrayOf(PropTypes.string)
};
export default function Archive({fetching, error, title, archive}) {
  let modifier;
  let content;

  if (fetching) {
    modifier = 'loading';
    content = 'Loading Archive...';
  } else if (error || !archive) {
    modifier = 'error';
    content = 'Error Loading Archive.';
  } else if (!archive.length) {
    modifier = 'empty';
    content = 'There are no articles in this archive';
  } else {
    modifier = 'list';
    content = (
      <ul className="archive__list">
        {archive.map(article => (
          <li key={article} className="archive__item">
            <Teaser article={article} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className={`archive archive--${modifier}`}>
      {title && <h2 className="archive__title">
        {title}
      </h2>}
      {content}
    </section>
  );
}
