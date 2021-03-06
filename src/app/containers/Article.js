import {connect} from 'react-redux';
import connectFetchActions, {fetchOnceOnRoute}
  from '../../utils/universal-redux-fetch/connectFetchActions';
import {fetchContentIfNeeded} from '../redux/content/actions';
import {getArticlePath, parseArticle} from '../redux/content/api.js';
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
    data: {
      authors,
      contributors,
      published,
      latestUpdate,
      title,
      description,
      body
    } = {}
  } = content[contentID] || {};

  let contributorsButNotAuthors = contributors;
  if (authors && authors.length && contributors && contributors.length) {
    const authorUsernames = authors.map(({username}) => username);
    contributorsButNotAuthors = contributors.filter(
      ({username}) => authorUsernames.indexOf(username) < 0
    );
  }

  return {
    fetching,
    error,
    authors,
    contributors: contributorsButNotAuthors,
    published,
    latestUpdate: latestUpdate && latestUpdate.date > published ? latestUpdate : null,
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
