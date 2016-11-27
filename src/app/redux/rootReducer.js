import {combineReducers} from 'redux';

import content from './content/reducer';
import forms from './forms/reducer';

export default combineReducers({
  content,
  forms
});
