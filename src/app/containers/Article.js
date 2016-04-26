import {connect} from 'react-redux';
import fetch from '../../utils/redux-universal-fetch/container';
import {fetchArticleIfNeeded} from '../redux/content/actions';
import Article from '../components/Article';

function mapStateToProps({
  content: {
    isFetching,
    error,
    data: {title, description, body}
  }
}) {
  return {
    isFetching,
    error,
    title,
    description,
    body
  };
}

export default connect(
  mapStateToProps
)(fetch(fetchArticleIfNeeded)(Article));
