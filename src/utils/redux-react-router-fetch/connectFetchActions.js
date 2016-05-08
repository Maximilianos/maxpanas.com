import React, {PropTypes, Component} from 'react';
import runFetchAction from './runFetchAction';


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

    runFetchActions({location: prevLocation = {}, params: prevParams = {}} = {}) {
      const {store} = this.context;
      const {location, params} = this.props;

      actions.forEach(action => runFetchAction(
        store,
        action,
        {location, params},
        {location: prevLocation, params: prevParams}
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