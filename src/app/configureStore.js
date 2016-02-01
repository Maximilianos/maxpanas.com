import {applyMiddleware, createStore} from 'redux';
import promiseMiddleware from 'redux-promise-middleware';

import rootReducer from './reducers';

export default function configureStore(initialState) {
  const middleware = [
    promiseMiddleware({
      promiseTypeSuffixes: ['PENDING', 'SUCCESS', 'FAILURE']
    })
  ];

  const createReduxStore = applyMiddleware(...middleware);

  return createReduxStore(createStore)(rootReducer, initialState);
}
