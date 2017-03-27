import { combineReducers } from 'redux';
import { routeReducer as routing} from 'react-router-redux';
import { reducer as reduxAsyncConnect } from 'redux-connect';

import post from './modules/post';
import posts from './modules/posts';

export default combineReducers({
  post,
  posts,
  routing,
  reduxAsyncConnect
});
