import React from 'react';
import {Route, IndexRoute} from 'react-router';

// static components
import App from './components/App';
import Home from './components/pages/Home';
import About from './components/pages/About';
import NotFound from './components/pages/NotFound';

// dynamic components
import Article from './containers/Article';


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
      <Route path="/:article" component={Article}/>
      <Route path="*" component={NotFound}/>
    </Route>
  );
}
