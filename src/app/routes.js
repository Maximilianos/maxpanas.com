import React from 'react';
import {Route, IndexRoute} from 'react-router';

import App from './App';
import Home from './pages/Home';
import About from './pages/About';
import NotFound from './pages/NotFound';

export function createRoutes() {
  return (
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="/about" component={About}/>
      <Route path="*" component={NotFound}/>
    </Route>
  );
}
