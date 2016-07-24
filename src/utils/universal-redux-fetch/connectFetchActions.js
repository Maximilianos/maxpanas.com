import React, {PropTypes, Component} from 'react';
import runFetchAction from './runFetchAction';

/**
 * Higher order action to make sure
 * a given action is not fired more
 * than once if the current route
 * has not changed
 *
 * @param action
 * @returns {Function}
 */
export function fetchOnceOnRoute(action) {
  return props => {
    // 1. Extract the route keys from the current and
    // previous route locations
    const {
      props: {location: {key}},
      prevProps: {location: {key: prevKey}}
    } = props;

    return dispatch => {
      // 2. Only dispatch the given action if the
      // previous and current route keys are different
      if (key !== prevKey) {
        return dispatch(action(props));
      }
    };
  };
}


/**
 * Container decorator used to
 * expose the wrapped component's
 * async action requirements
 *
 * @param actions
 * @returns {Function}
 */
export default function connectFetchActions(...actions) {
  return Wrapped => class Fetch extends Component {
    static contextTypes = {
      store: PropTypes.object // the Redux store
    };

    // Passed via react-router or can be
    // passed manually in React Native
    static propTypes = {
      location: PropTypes.object,
      params: PropTypes.object
    };

    // For server side rendering
    // use with ./runComponentFetchActions.js#runComponentFetchActions
    static fetchActions = actions;

    runFetchActions(prevProps = {}) {
      const {store} = this.context;

      actions.forEach(action => runFetchAction(
        store,
        action,
        this.props,
        prevProps
      ));
    }

    // For client side rendering
    componentDidMount = this.runFetchActions;
    componentDidUpdate = this.runFetchActions;

    render() {
      return <Wrapped {...this.props} />;
    }
  };
}
