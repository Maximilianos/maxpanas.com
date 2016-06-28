import React, {PropTypes} from 'react';
import Helmet from 'react-helmet';

import Max from '../../Logo/Max';
import Archive from '../../Articles/Archive/Archive';

import './Home.scss';

function Home({fetching, error, archive}) {
  return (
    <main className="home">
      <Helmet
        title="Home"
        description="
          My name is Max. I write code for the web. Sometimes
          I share the code that I've written. Sometimes I give talks
          about code. This is my website. This is where I focus on
          writing about code.
        "
      />
      <div className="home__hero">
        <p>
          My name is <Max />. I write code for the web. Sometimes
          I share the code that I've written. Sometimes I give talks
          about code. This is my website. This is where I focus on
          writing about code.
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
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  archive: PropTypes.oneOfType([PropTypes.bool, PropTypes.arrayOf(PropTypes.string)])
};

export default Home;
