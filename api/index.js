import Express from 'express';
import http from 'http';
import compression from 'compression';
import mongoose from 'mongoose';
import postCreate from './post/create';
import postUpdate from './post/update';
import postGet from './post/get';
import postsGet from './posts/get';
import bodyParser from 'body-parser';

const app = new Express();
const server = new http.Server(app);

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

mongoose.connect('mongodb://localhost/bloks-cms-test1');
mongoose.Promise = global.Promise;

app.post('/post/create/', postCreate);
app.post('/post/update/', postUpdate);
app.get('/post/get/*', postGet);
app.get('/posts/', postsGet);

server.listen(3000, (err) => {
  if (err) {
    console.error(err);
  }
  console.info('==> 💻  http://localhost:3000 is waiting for requests and is syncing.');
});
