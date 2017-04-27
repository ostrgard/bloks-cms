import React, { Component, PropTypes } from 'react';
import { asyncConnect } from 'redux-connect';
import { connect } from 'react-redux';
import { loadPost } from 'redux/modules/post';
import { loadPosts } from 'redux/modules/posts';
import EditPost from 'components/EditPost/EditPost';

@asyncConnect([
  {
    promise: ({ store, params }) => {
      const promise = store.dispatch(loadPost(params.splat));
      return __SERVER__ ? promise : Promise.resolve();
    }
  },
  {
    promise: ({ store }) => {
      const promise = store.dispatch(loadPosts());
      return __SERVER__ ? promise : Promise.resolve();
    }
  }
])
@connect(
  state => ({
    post: state.post.data,
    posts: state.posts.data
  })
)
export default class Post extends Component {
  static propTypes = {
    post: PropTypes.object,
    posts: PropTypes.array
  }

  render() {
    const {
      post,
      posts
    } = this.props;

    return post && post.pathname ? <EditPost post={post} posts={posts} /> : null;
  }
}
