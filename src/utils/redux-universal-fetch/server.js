/**
 *
 *
 * @param dispatch
 * @param components
 * @param location
 * @param params
 */
export function fetchComponentDataAsync(dispatch, {components, location, params}) {
  const promises = components
    .reduce((actions, component) =>
      actions.concat(component.fetchActions || [])
    , [])
    .map(action =>
      // Server side fetching can use only router location and params props
      // There is no easy way to support custom component props
      dispatch(action({location, params})).payload.promise
    );

  return Promise.all(promises);
}
