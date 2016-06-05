import {connect} from 'react-redux';
import connectFetchActions from '../../utils/redux-react-router-fetch/connectFetchActions';
import {fetchContentIfNeeded} from '../redux/content/actions';
import {getArchivePath, parseGitHubResponse} from '../redux/content/github';
import Home from '../components/Pages/Home/Home';

const contentID = getArchivePath('articles');


/**
 * Map the content state to the
 * currently viewed archive
 *
 * @param content
 * @returns {{fetching, error, data}}
 */
function mapStateToProps({content}) {
  const {
    fetching,
    error,
    data
  } = content[contentID] || {};

  const archive = data ? data.map(
    ({name}) => name.slice(0, name.lastIndexOf('.'))
  ) : [];

  return {
    fetching,
    error,
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
      return dispatch(fetchContentIfNeeded(contentID, {responseParser: parseGitHubResponse}));
    }
  };
}

export default connect(mapStateToProps)(
  connectFetchActions(fetchArchive)(
    Home
  )
);
