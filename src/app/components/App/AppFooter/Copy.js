import React, {PropTypes} from 'react';


Copy.propTypes = {
  start: PropTypes.number,
  end: PropTypes.number,
  sep: PropTypes.string
};
export default function Copy({
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
