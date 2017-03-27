import {
  POST_LOAD,
  POST_LOAD_SUCCESS,
  POST_LOAD_FAIL
} from 'redux/actions';

export default (
  state = {
    loading: false,
    error: null,
    data: {}
  },
  action = {}
) => {
  switch (action.type) {
    case POST_LOAD:
      return {
        ...state,
        loading: true
      };
    case POST_LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        data: action.result
      };
    case POST_LOAD_FAIL:
      return {
        ...state,
        loading: false,
        error: true
      };
    default:
      return state;
  }
};

export const loadPost = pathname => ({
  types: [POST_LOAD, POST_LOAD_SUCCESS, POST_LOAD_FAIL],
  promise: (client) => client.get(`http://localhost:3000/post/get/${pathname}`)
});
