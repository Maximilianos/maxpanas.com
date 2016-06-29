import React from 'react';
import {IndexLink} from 'react-router';
import Error from '../../Error/Error';


export default function NotFound() {
  return (
    <Error
      code={404}
      title="404"
      subtitle="Not Found."
    >
      <p>
        <IndexLink to="/">
          Back Home?
        </IndexLink>
      </p>
    </Error>
  );
}
