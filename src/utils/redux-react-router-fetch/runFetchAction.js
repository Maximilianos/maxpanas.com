const emptyProps = {
  location: {},
  params: {}
};

/**
 * Note: Server side fetching can only use router location and params props
 * There is no easy way to support custom component props
 *
 * @param dispatch
 * @param getState
 * @param action
 * @param props
 * @param prevProps
 */
export default function runFetchAction(
  {dispatch, getState},
  action,
  props = emptyProps,
  prevProps = emptyProps,
) {
  return dispatch(action({
    props,
    prevProps,
    getState,
  }));
}
