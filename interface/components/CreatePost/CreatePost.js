import React, { Component } from 'react';
import superagent from 'superagent';
import { browserHistory } from 'react-router';

export default class EditPost extends Component {
  saveChanges = () => {
    superagent
      .post('http://localhost:3000/post/create/')
      .send()
      .end((err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log('saved: ', res);
          browserHistory.push('/edit' + res.body.pathname);
        }
      });
  }

  render() {
    return <button onClick={this.saveChanges}>Create post</button>;
  }
}
