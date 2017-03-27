import React from 'react';
import { IndexRoute, Route } from 'react-router';
import { App, Posts, Post } from 'containers';

export default () =>
  <Route path="/" component={App} >
    <IndexRoute component={Posts} />
    <Route path="/edit/*" component={Post} />
    <Route path="*" component={Posts} />
  </Route>;
