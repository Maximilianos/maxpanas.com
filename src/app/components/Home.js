import React, {PropTypes} from 'react';
import Helmet from 'react-helmet';

import Entry from './Entry';
import Archive from './Archive';

function Home({fetching, error, data}) {
  const archive = data.map(({name}) => name.slice(0, name.lastIndexOf('.')));
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
  data: PropTypes.arrayOf(PropTypes.object)
};

export default Home;
