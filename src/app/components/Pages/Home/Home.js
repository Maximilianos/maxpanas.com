import React, {PropTypes} from 'react';
import Helmet from 'react-helmet';

import Archive from '../../Articles/Archive/Archive';

import './Home.scss';

function Home({fetching, error, archive}) {
  return (
    <main className="home">
      <Helmet
        title="Home"
        description="
          Musings about software best practices for the Web
          by Max GJ Panas.
        "
      />
      <header className="">
        
      </header>
      <div className="home__archive">
        <Archive
          fetching={fetching}
          error={error}
          archive={archive}
        />
      </div>
    </main>
  );
}

Home.propTypes = {
  fetching: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  archive: PropTypes.arrayOf(PropTypes.string)
};

export default Home;
