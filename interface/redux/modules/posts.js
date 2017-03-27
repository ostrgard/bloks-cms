import {
  POSTS_LOAD,
  POSTS_LOAD_SUCCESS,
  POSTS_LOAD_FAIL
} from 'redux/actions';

export default (
  state = {
    loading: false,
    error: null,
    data: []
  },
  action = {}
) => {
  switch (action.type) {
    case POSTS_LOAD:
      return {
        ...state,
        loading: true
      };
    case POSTS_LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        data: action.result
      };
    case POSTS_LOAD_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
        data: []
      };
    default:
      return state;
  }
};

export const loadPosts = () => ({
  types: [POSTS_LOAD, POSTS_LOAD_SUCCESS, POSTS_LOAD_FAIL],
  promise: (client) => client.get('http://localhost:3000/posts/')
});
