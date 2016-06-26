import React, {PropTypes} from 'react';

import './Logo.scss';

function Max({dot = false}) {
  return (
    <span className="logo">
      MAX
      {dot && <span className="logo__dot">.</span>}
    </span>
  );
}

Max.propTypes = {
  dot: PropTypes.bool
};

export default Max;
