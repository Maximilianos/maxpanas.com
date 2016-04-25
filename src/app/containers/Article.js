import {connect} from 'react-redux';
import fetch from '../../utils/redux-universal-fetch/container';
import {fetchArticleIfNeeded} from '../redux/content/actions';
import Article from '../components/pages/Article';

function mapStateToProps({content}) {
  return {
    content
  };
}

export default connect(
  mapStateToProps
)(fetch(fetchArticleIfNeeded)(Article));
