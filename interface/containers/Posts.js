import React, { Component, PropTypes } from 'react';
import { asyncConnect } from 'redux-connect';
import { connect } from 'react-redux';
import { loadPosts } from 'redux/modules/posts';
import PostList from 'components/PostList/PostList';
import CreatePost from 'components/CreatePost/CreatePost';

@asyncConnect([{
  promise: ({ store }) => {
    const promise = store.dispatch(loadPosts());
    return __SERVER__ ? promise : Promise.resolve();
  }
}])
@connect(
  state => ({
    posts: state.posts.data
  })
)
export default class Posts extends Component {
  static propTypes = {
    posts: PropTypes.array
  }

  render() {
    const {
      posts
    } = this.props;

    return (
      <div>
        <PostList posts={posts} />
        <CreatePost />
      </div>
    );
  }
}
