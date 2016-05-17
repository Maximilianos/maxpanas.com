import React, {PropTypes} from 'react';
import Entry from './Entry';

function TeaserError() {
  return (
    <Entry title="Error 500">
      Sorry there was a problem completing this request
    </Entry>
  );
}

function NoTeaserFound() {
  return (
    <Entry title="Error 404">
      Sorry there is no article at this url
    </Entry>
  );
}


function Teaser({fetching, error, title, description}) {
  if (fetching) return <Entry title="Loading..." />;

  if (error) {
    return (
      (error.response && error.response.status === 404)
        ? <NoTeaserFound />
        : <TeaserError />
    );
  }

  return (
    <Entry title={title}>
      {description}
    </Entry>
  );
}

Teaser.propTypes = {
  fetching: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  title: PropTypes.string,
  description: PropTypes.string
};

export default Teaser;
