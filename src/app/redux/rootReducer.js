import {combineReducers} from 'redux';

import content from './content/reducer';
import form from './form/reducer';

export default combineReducers({
  content,
  form
});
