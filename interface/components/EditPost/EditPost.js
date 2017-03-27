import React, { Component, PropTypes } from 'react';
import superagent from 'superagent';

export default class EditPost extends Component {
  static propTypes = {
    post: PropTypes.object
  }

  saveChanges = () => {
    const slug = this.slugInput.value;
    const title = this.titleInput.value;

    superagent
      .post('http://localhost:3000/post/update/')
      .send({
        id: this.props.post._id,
        slug: slug,
        title: title
      })
      .end((err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log('saved: ', res);
        }
      });
  }

  render() {
    const {
      post
    } = this.props;

    return (
      <div>
        <div>
          <input ref={ref => this.titleInput = ref} defaultValue={post.title} />
        </div>
        <div>
          {post.pathname.replace(`${post.slug}/`, '')}<input ref={ref => this.slugInput = ref} defaultValue={post.slug} />
        </div>
        <button onClick={this.saveChanges}>Save changes</button>
      </div>
    );
  }
}
