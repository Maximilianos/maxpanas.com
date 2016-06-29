import React, {PropTypes} from 'react';

import './Max.scss';

Max.propTypes = {
  dot: PropTypes.bool
};
export default function Max({dot = false}) {
  return (
    <span className="max">
      MAX
      {dot && <span className="max__dot">.</span>}
    </span>
  );
}
