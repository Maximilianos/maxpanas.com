import React from 'react';
import {Route, IndexRoute} from 'react-router';

import App from './containers/App';
import Home from './containers/pages/Home';
import About from './containers/pages/About';
import Article from './containers/pages/Article';
import NotFound from './containers/pages/NotFound';


/**
 * Create the application's
 * routes
 *
 * @returns {*}
 */
export default function createRoutes() {
  return (
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="/about" component={About}/>
      <Route path="/:content" component={Article}/>
      <Route path="*" component={NotFound}/>
    </Route>
  );
}
