import {connect} from 'react-redux';
import connectFetchActions from '../../utils/redux-react-router-fetch/connectFetchActions';
import {fetchContentIfNeeded} from '../redux/content/actions';
import {getArticlePath} from '../redux/content/github';
import Article from '../components/Article';


/**
 * Map the content state to the
 * currently viewed article
 *
 * @param content
 * @param article
 * @returns {{fetching: *, error, title, description, body}}
 */
function mapStateToProps({content}, {params: {article}}) {
  const contentID = getArticlePath(article);

  const {
    fetching,
    error,
    data: {title, description, body} = {}
  } = content[contentID] || {};

  return {
    fetching,
    error,
    title,
    description,
    body
  };
}


/**
 * Create the article fetching
 * action
 *
 * @param article
 * @param key
 * @param prevKey
 * @returns {Function}
 */
function fetchArticle({
  props: {location: {key}, params: {article}},
  prevProps: {location: {key: prevKey}}
}) {
  return dispatch => {
    if (key !== prevKey) {
      const contentURL = getArticlePath(article);
      return dispatch(fetchContentIfNeeded(contentURL));
    }
  };
}


export default connect(mapStateToProps)(
  connectFetchActions(fetchArticle)(
    Article
  )
);
