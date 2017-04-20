import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import cors from 'kcors';
import mongoose from 'mongoose';

import postCreate from './post/create';
import postGet from './post/get';
import postUpdate from './post/update';
import postsGet from './posts/get';

const port = 3000;
const host = 'localhost';
const url = port === 80 || port === 443 ? `http://${host}` : `http://${host}:${port}`;
const mongodb = process.env.NODE_ENV === 'test' ? 'bloks-cms-test' : 'bloks-cms';

mongoose.connect('mongodb://localhost/' + mongodb);
mongoose.Promise = global.Promise;

const app = new Koa();
const router = new Router();
app.use(bodyParser());
app.use(cors());

app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

router.post('/post/create/', postCreate);
router.get('/post/get/*', postGet);
router.post('/post/update/', postUpdate);
router.get('/posts/', postsGet);

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(port);

console.info(`==> 💻  ${url} is waiting for requests and is syncing.`);

export default url;
