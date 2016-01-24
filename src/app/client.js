import React from 'react';
import ReactDOM from 'react-dom';
import Router, {browserHistory} from 'react-router';
import Bluebird from 'bluebird';
import 'isomorphic-fetch';

import createRoutes from './createRoutes';

// http://bluebirdjs.com/docs/why-bluebird.html
window.Promise = Bluebird;

ReactDOM.render(
  <Router history={browserHistory}>
    {createRoutes()}
  </Router>,
  document.getElementById('root')
);
