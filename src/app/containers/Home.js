import {connect} from 'react-redux';
import connectFetchActions from '../../utils/redux-react-router-fetch/connectFetchActions';
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
 * @param key
 * @param prevKey
 * @returns {function()}
 */
function fetchArchive({
  props: {location: {key}},
  prevProps: {location: {key: prevKey}}
}) {
  return dispatch => {
    if (key !== prevKey) {
      return dispatch(fetchContentIfNeeded(
        getArchivePath(archive),
        {responseParser: parseArchive}
      ));
    }
  };
}


export default connect(mapStateToProps)(
  connectFetchActions(fetchArchive)(
    Home
  )
);
