import {compose, applyMiddleware, createStore} from 'redux';
import promiseMiddleware from 'redux-promise-middleware';

import rootReducer from './reducers';

const BROWSER_DEVELOPMENT = (
  process.env.NODE_ENV !== 'production'
  && process.env.IS_BROWSER
);

export default function configureStore(initialState) {
  const middleware = [
    promiseMiddleware({
      promiseTypeSuffixes: ['PENDING', 'SUCCESS', 'FAILURE']
    })
  ];

  const createReduxStore = BROWSER_DEVELOPMENT && window.devToolsExtension
    ? compose(applyMiddleware(...middleware), window.devToolsExtension())
    : applyMiddleware(...middleware);

  const store = createReduxStore(createStore)(rootReducer, initialState);

  // Enable hot reload where available.
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers.
    module.hot.accept('./reducers', () => {
      const nextAppReducer = require('./reducers');
      store.replaceReducer(nextAppReducer);
    });
  }

  return store;
}
