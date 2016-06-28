import React, {PropTypes} from 'react';
import Teaser from '../../../containers/Teaser';

import './Archive.scss';

function Archive({fetching, error, archive}) {
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
    <div className={`archive archive--${modifier}`}>
      {content}
    </div>
  );
}

Archive.propTypes = {
  fetching: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  archive: PropTypes.oneOfType([PropTypes.bool, PropTypes.arrayOf(PropTypes.string)])
};

export default Archive;
