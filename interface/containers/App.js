import React, { Component, PropTypes } from 'react';

require('theme/main.scss');

export default class App extends Component {
  static propTypes = {
    children: PropTypes.object
  };

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}
