import React, { Component, PropTypes } from 'react';
import axios from 'axios';

export default class EditPost extends Component {
  static propTypes = {
    post: PropTypes.object
  }

  saveChanges = () => {
    const slug = this.slugInput.value;
    const title = this.titleInput.value;

    axios.post(
      'http://localhost:3000/post/update/',
      {
        id: this.props.post._id,
        slug: slug,
        title: title
      }
    ).then(() => {
      console.log('saved');
    }).catch((error) => {
      console.log(error);
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
