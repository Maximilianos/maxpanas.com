import React, {PropTypes} from 'react';
import Helmet from 'react-helmet';

import Entry from './Entry';
import Archive from './Archive';

function Home({fetching, error, archive}) {
  return (
    <div>
      <Entry title="Welcome to my Website!">
        <Helmet title="Home" />
      </Entry>
      <Archive
        fetching={fetching}
        error={error}
        archive={archive}
      />
    </div>
  );
}

Home.propTypes = {
  fetching: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  archive: PropTypes.arrayOf(PropTypes.string)
};

export default Home;
