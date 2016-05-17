import React, {PropTypes} from 'react';

import Teaser from '../containers/Teaser';

function Archive({fetching, error, archive}) {
  if (fetching) return <div>Loading Archive...</div>;
  if (error) return <div>Error Loading Archive.</div>;

  return archive ? (
    <ul>
      {archive.map(article => (
        <li key={article}>
          <Teaser article={article} />
        </li>
      ))}
    </ul>
  ) : <div />;
}

Archive.propTypes = {
  fetching: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  archive: PropTypes.arrayOf(PropTypes.string)
};

export default Archive;
