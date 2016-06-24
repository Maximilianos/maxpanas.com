import React from 'react';
import {Route, IndexRoute} from 'react-router';

// static components
import App from './components/App/App';
import About from './components/Pages/About/About';
import NotFound from './components/Pages/NotFound/NotFound';

// dynamic components
import Home from './containers/Home';
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
      <IndexRoute component={Home} />
      <Route path="about" component={About} />
      <Route path=":article" component={Article} />
      <Route path="*" component={NotFound} />
    </Route>
  );
}
