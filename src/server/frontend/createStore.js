import configureStore from '../../app/redux/configureStore';


/**
 * Middleware to decorate the request object with
 * the redux store for the current session
 *
 * @param req
 * @param res
 * @param next
 */
export default function createStore(req, res, next) {
  req.store = configureStore();
  next();
}
