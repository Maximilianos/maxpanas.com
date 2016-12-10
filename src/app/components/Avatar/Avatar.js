import React, {PropTypes} from 'react';

import './Avatar.scss';

Avatar.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  size: PropTypes.number,
  title: PropTypes.string,
  className: PropTypes.string
};
export default function Avatar({src, alt, size, title, className}) {
  const finalClassName = className
    ? `avatar ${className}`
    : 'avatar';

  const finalSrc = size
    ? `${src}&s=${size}`
    : src;

  return (
    <img
      className={finalClassName}
      src={finalSrc}
      alt={alt}
      width={size}
      height={size}
      title={title}
    />
  );
}
