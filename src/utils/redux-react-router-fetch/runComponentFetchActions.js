import runFetchAction from './runFetchAction';

/**
 *
 *
 * @param store
 * @param components
 * @param location
 * @param params
 */
export default function runComponentFetchActions(store, {components, location, params}) {
  const promises = components
    .reduce((actions, {fetchActions = []}) => actions.concat(fetchActions), [])
    .map(action => runFetchAction(store, action, {location, params}));

  return Promise.all(promises);
}
