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
            - {post._id} - {post.pathname}
          </div>
        )}
      </div>
    );
  }
}
