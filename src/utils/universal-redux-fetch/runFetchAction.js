const defaultProps = {
  location: {},
  params: {}
};

/**
 * Dispatch a fetch action passing in the current and
 * previous properties of the component
 *
 * IMPORTANT NOTE:
 * Server side fetching can only use router location and params props
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
  props = defaultProps,
  prevProps = defaultProps,
) {
  return dispatch(action({
    props: {...defaultProps, ...props},
    prevProps: {...defaultProps, ...prevProps},
    getState,
  }));
}
