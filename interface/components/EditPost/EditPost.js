import React, { Component, PropTypes } from 'react';
import superagent from 'superagent';
import { browserHistory } from 'react-router';

export default class EditPost extends Component {
  static propTypes = {
    post: PropTypes.object,
    posts: PropTypes.array
  }

  getParentOptions(posts = [], id, indent = 0) {
    return posts
      .filter(n => n._id !== id && !n.root)
      .reduce((pre, cur) => pre.concat({ ...cur, indent }, this.getParentOptions(cur.children, id, indent + 1)), []);
  }

  getIndentDashes(n) {
    let str = '';

    for (let i = 0; i < n; i++) {
      str += '-';
    }

    return str;
  }

  saveChanges = () => {
    const slug = this.slugInput.value;
    const title = this.titleInput.value;
    const parent = this.parentInput.value;

    superagent
      .post('http://localhost:3000/post/update/')
      .send({
        id: this.props.post._id,
        slug,
        title,
        parent
      })
      .end((err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log('saved: ', res);
          browserHistory.replace('/edit' + res.body.pathname);
        }
      });
  }

  render() {
    const {
      post
    } = this.props;

    const posts = this.getParentOptions(this.props.posts, post._id);

    return (
      <div>
        <div>
          <input ref={ref => this.titleInput = ref} defaultValue={post.title} />
        </div>
        {!post.root && (
        <div>
          {post.pathname.replace(`${post.slug}/`, '')}<input ref={ref => this.slugInput = ref} defaultValue={post.slug} />
        </div>
        )}
        {!post.root && (
          <select defaultValue={post.parent} ref={ref => this.parentInput = ref}>
            <option value="unset">Root</option>
            {posts.map(n => <option key={n._id} value={n._id}>{this.getIndentDashes(n.indent)} {n.title}</option>)}
          </select>
        )}
        <button onClick={this.saveChanges}>Save changes</button>
      </div>
    );
  }
}
