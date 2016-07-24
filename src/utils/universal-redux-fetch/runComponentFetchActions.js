import runFetchAction from './runFetchAction';

/**
 * Run the current route's top level component's fetch
 * actions to populate the store. Used on the server to
 * populate the redux store before synchronously
 * rendering the html
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
