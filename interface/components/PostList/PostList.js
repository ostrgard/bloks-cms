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
        {posts.map((post, index) =>
          <div key={index}>
            <a href={`/edit${post.pathname}`}>
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
