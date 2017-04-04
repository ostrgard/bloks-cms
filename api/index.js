const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const cors = require('koa-cors');
const mongoose = require('mongoose');

const postCreate = require('./post/create');
const postGet = require('./post/get');
const postUpdate = require('./post/update');
const postsGet = require('./posts/get');

mongoose.connect('mongodb://localhost/bloks-cms-test1');
mongoose.Promise = global.Promise;

const app = new Koa();
const router = new Router();
app.use(bodyParser());
app.use(cors());

router.post('/post/create/', postCreate);
router.get('/post/get/*', postGet);
router.post('/post/update/', postUpdate);
router.get('/posts/', postsGet);

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);

console.info('==> 💻  http://localhost:3000 is waiting for requests and is syncing.');
