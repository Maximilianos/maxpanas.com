import React from 'react';
import Error from '../../containers/Error';


export default function NotFound() {
  return (
    <Error
      code={404}
      title="404"
      subtitle="Not Found"
      message="The page you are looking for does not exist"
    />
  );
}
