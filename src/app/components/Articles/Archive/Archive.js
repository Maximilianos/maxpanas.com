import React, {PropTypes} from 'react';
import Teaser from '../../../containers/Teaser';

import './Archive.scss';

function Archive({fetching, error, archive}) {
  if (fetching) {
    return (
      <div className="archive archive--loading">
        Loading Archive...
      </div>
    );
  }

  if (error) {
    return (
      <div className="archive archive--error">
        Error Loading Archive.
      </div>
    );
  }

  return archive ? (
    <ul className="archive archive--list">
      {archive.map(article => (
        <li key={article} className="archive__item">
          <Teaser article={article} />
        </li>
      ))}
    </ul>
  ) : (
    <div className="archive archive--empty">
      There are no articles in this archive
    </div>
  );
}

Archive.propTypes = {
  fetching: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  archive: PropTypes.arrayOf(PropTypes.string)
};

export default Archive;
