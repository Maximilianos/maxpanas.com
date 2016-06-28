import React, {PropTypes} from 'react';
import Helmet from 'react-helmet';

import Max from '../../Logo/Max';
import Archive from '../../../containers/Archive';

import './Home.scss';

function Home({archive}) {
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
        <Archive archive={archive} />
      </div>
    </main>
  );
}

Home.propTypes = {
  archive: PropTypes.string
};

export default Home;
