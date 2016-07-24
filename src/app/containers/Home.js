import {connect} from 'react-redux';
import connectFetchActions, {fetchOnceOnRoute}
  from '../../utils/redux-react-router-fetch/connectFetchActions';
import {fetchContentIfNeeded} from '../redux/content/actions';
import {getArchivePath, parseArchive} from '../redux/content/github';
import Home from '../components/Pages/Home/Home';


/**
 * The archive to show on
 * the Homepage
 *
 * @type {string}
 */
const archive = 'articles';


/**
 * Map the content state to the
 * currently viewed archive
 *
 * @returns {{archive}}
 */
function mapStateToProps() {
  return {
    archive
  };
}


/**
 * Create the archive fetching
 * action
 *
 * @returns {function()}
 */
function fetchArchive() {
  return fetchContentIfNeeded(
    getArchivePath(archive),
    {responseParser: parseArchive}
  );
}


export default connect(mapStateToProps)(
  connectFetchActions(fetchOnceOnRoute(fetchArchive))(
    Home
  )
);
