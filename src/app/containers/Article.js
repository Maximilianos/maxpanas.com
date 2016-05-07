import {connect} from 'react-redux';
import fetch from '../../utils/redux-universal-fetch/container';
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
 * @returns {Function}
 */
function fetchArticle({params: {article}}) {
  const contentURL = getArticlePath(article);
  return fetchContentIfNeeded(contentURL);
}


export default connect(mapStateToProps)(
  fetch(fetchArticle)(Article)
);
