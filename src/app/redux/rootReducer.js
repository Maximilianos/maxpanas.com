import {combineReducers} from 'redux';
import {reducer as form} from 'redux-form';

import content from './content/reducer';

export default combineReducers({
  content,
  form
});
