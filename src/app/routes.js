import React from 'react';
import {Route, IndexRoute} from 'react-router';

import App from './components/App';
import Home from './components/Home';
import NotFound from './components/NotFound';

export function createRoutes() {
  return (
    <Route component={App} path="/">
      <IndexRoute component={Home} />
      <Route component={NotFound} path="*"/>
    </Route>
  );
}
