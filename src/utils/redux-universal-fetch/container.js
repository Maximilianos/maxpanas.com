import React, {PropTypes, Component} from 'react';

/**
 * Container decorator used to
 * expose the wrapped component's
 * async action requirements
 *
 * @param actions
 * @returns {Function}
 */
export default function fetch(...actions) {
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
    // use with ./server.js#fetchComponentDataAsync
    static fetchActions = actions;

    // For client side rendering
    componentDidMount = this.runFetchActions;
    componentDidUpdate = this.runFetchActions;

    runFetchActions() {
      const {store} = this.context;
      const {location, params} = this.props;
      actions.forEach(action => store.dispatch(action({location, params, store})));
    }

    render() {
      return <Wrapped {...this.props} />;
    }
  };
}
