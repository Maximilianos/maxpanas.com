import {connect} from 'react-redux';
import connectFetchActions from '../../utils/universal-redux-fetch/connectFetchActions';
import {fetchContentIfNeeded} from '../redux/content/actions';
import {getArticlePath, parseArticle} from '../redux/content/github';
import Teaser from '../components/Articles/Teaser/Teaser';


/**
 * Map the content state to the
 * currently viewed article
 *
 * @param content
 * @param article
 * @returns {{fetching: *, error, title, description, body}}
 */
function mapStateToProps({content}, {article}) {
  const contentID = getArticlePath(article);
  const {
    fetching,
    error,
    data: {title, description} = {}
  } = content[contentID] || {};

  return {
    fetching,
    error,
    title,
    excerpt: description
  };
}


/**
 * Create the article fetching
 * action
 *
 * @param article
 * @returns {Function}
 */
function fetchArticle({props: {article}}) {
  return dispatch => {
    if (article) {
      return dispatch(fetchContentIfNeeded(
        getArticlePath(article),
        {responseParser: parseArticle}
      ));
    }
  };
}


export default connect(mapStateToProps)(
  connectFetchActions(fetchArticle)(
    Teaser
  )
);
