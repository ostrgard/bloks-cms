import React, { Component, PropTypes } from 'react';

// const styles = require('./PostList.scss');

export default class PostList extends Component {
  static propTypes = {
    posts: PropTypes.array
  }

  render() {
    const {
      posts
    } = this.props;

    return (
      <div>
        {posts.map(post =>
          <div
            key={post._id}
            style={{ marginLeft: !post.parent && !post.root ? 20 : 0 }}
          >
            <a href={`/edit/post${post.pathname}`}>
              {post.title || post._id}
            </a>
            <span style={{ fontSize: 8 }}> - {post.pathname} - {post._id}</span>
            {post.children && (
              <div style={{ marginLeft: 20 }}>
                <PostList posts={post.children} />
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}
