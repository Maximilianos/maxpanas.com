import React, {PropTypes} from 'react';
import NestedStatus from 'react-nested-status';
import Helmet from 'react-helmet';
import Entry from '../Entry/Entry';

function Error({code, title, subtitle, children}) {
  return (
    <Entry title={title} subtitle={subtitle}>
      <NestedStatus code={code} />
      <Helmet title={title} />
      {children}
    </Entry>
  );
}

Error.propTypes = {
  code: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  children: PropTypes.node
};

export default Error;
