import {connect} from 'react-redux';
import connectFetchActions from '../../utils/redux-react-router-fetch/connectFetchActions';
import {fetchContentIfNeeded} from '../redux/content/actions';
import {getArchivePath, parseArchive} from '../redux/content/github';
import Archive from '../components/Articles/Archive/Archive';


/**
 * Map the content state to the
 * currently viewed archive
 *
 * @param content
 * @param archive
 * @returns {{fetching, error, data}}
 */
function mapStateToProps({content}, {archive}) {
  const contentID = getArchivePath(archive);
  const {
    fetching,
    error,
    data
  } = content[contentID] || {};

  return {
    fetching,
    error,
    archive: data
  };
}


/**
 * Create the archive fetching
 * action
 *
 * @param archive
 * @returns {Function}
 */
function fetchArchive({props: {archive}}) {
  return dispatch => {
    if (archive) {
      return dispatch(fetchContentIfNeeded(
        getArchivePath(archive),
        {responseParser: parseArchive}
      ));
    }
  };
}


export default connectFetchActions(fetchArchive)(
  connect(mapStateToProps)(
    Archive
  )
);
