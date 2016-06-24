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
      <div className="home__hero">
        <p>
          My name is <i className="home__logo">Max</i>. I write code
          for the web. Sometimes I share the code that I've written.
          Sometimes I give talks about code. This is <i>my</i> website.
          This is where I focus on writing <i>about</i> code.
        </p>
      </div>
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
