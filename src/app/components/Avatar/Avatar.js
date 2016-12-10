import React, {PropTypes} from 'react';

import './Avatar.scss';

Avatar.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  size: PropTypes.number,
  title: PropTypes.string
};
export default function Avatar({src, alt, size, title}) {
  const finalSrc = size
    ? `${src}&s=${size}`
    : src;

  return (
    <img
      className="avatar"
      src={finalSrc}
      alt={alt}
      width={size}
      height={size}
      title={title}
    />
  );
}
