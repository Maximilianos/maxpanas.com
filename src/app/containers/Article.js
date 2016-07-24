import {connect} from 'react-redux';
import connectFetchActions, {fetchOnceOnRoute}
  from '../../utils/redux-react-router-fetch/connectFetchActions';
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
 * @returns {Function}
 */
function fetchArticle({props: {params: {article}}}) {
  return fetchContentIfNeeded(
    getArticlePath(article),
    {responseParser: parseArticle}
  );
}


export default connect(mapStateToProps)(
  connectFetchActions(fetchOnceOnRoute(fetchArticle))(
    Article
  )
);
