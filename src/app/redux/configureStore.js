import {compose, applyMiddleware, createStore} from 'redux';
import thunkMiddleware from 'redux-thunk';

import rootReducer from './rootReducer';

const BROWSER_DEVELOPMENT = (
  process.env.NODE_ENV !== 'production'
  && process.env.IS_BROWSER
);


/**
 * Configure the redux store given
 * an intial state
 *
 * @param initialState
 * @returns {*}
 */
export default function configureStore(initialState = {}) {
  const middleware = [
    thunkMiddleware
  ];

  const createReduxStore = (
    BROWSER_DEVELOPMENT && window.devToolsExtension
      ? compose(applyMiddleware(...middleware), window.devToolsExtension())
      : applyMiddleware(...middleware)
  );

  const store = createReduxStore(createStore)(rootReducer, initialState);

  // Enable hot reload where available.
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers.
    module.hot.accept('./rootReducer', () => {
      const nextAppReducer = global.require('./rootReducer');
      store.replaceReducer(nextAppReducer);
    });
  }

  return store;
}
