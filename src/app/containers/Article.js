import {connect} from 'react-redux';
import connectFetchActions from '../../utils/redux-react-router-fetch/connectFetchActions';
import {fetchContentIfNeeded} from '../redux/content/actions';
import {getArticlePath, parseArticle} from '../redux/content/github';
import Article from '../components/Articles/Article/Article';


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
      return dispatch(fetchContentIfNeeded(
        getArticlePath(article),
        {responseParser: parseArticle}
      ));
    }
  };
}


export default connect(mapStateToProps)(
  connectFetchActions(fetchArticle)(
    Article
  )
);
