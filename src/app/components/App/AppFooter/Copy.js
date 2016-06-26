import React, {PropTypes} from 'react';

function Copy({
  start,
  end = (new Date()).getFullYear(),
  sep = ' - '
}) {
  const duration = end > start ? `${start}${sep}${end}` : start;
  return (
    <span>
      &copy; {duration}
    </span>
  );
}

Copy.propTypes = {
  start: PropTypes.number,
  end: PropTypes.number,
  sep: PropTypes.string
};

export default Copy;
