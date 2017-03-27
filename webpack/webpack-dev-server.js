var Express = require('express');
var webpack = require('webpack');
var https = require('https');
var http = require('http');
var fs = require('fs');

var webpackConfig = require('./dev.config');
var compiler = webpack(webpackConfig);

var serverOptions = {
  quiet: true,
  noInfo: true,
  hot: true,
  inline: true,
  lazy: false,
  publicPath: webpackConfig.output.publicPath,
  headers: {'Access-Control-Allow-Origin': '*'},
  stats: {colors: true}
};

var app = new Express();

app.use(require('webpack-dev-middleware')(compiler, serverOptions));
app.use(require('webpack-hot-middleware')(compiler));

var server = http.createServer(app);

server.listen(3001, function onAppListening(err) {
  if (err) {
    console.error(err);
  } else {
    console.info('==> 🚧  Webpack development server listening on http://localhost:3001');
  }
});
