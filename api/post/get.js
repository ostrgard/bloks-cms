import Post from '../models/Post';

export default async ctx => {
  const pathname = `/${ctx.params[0]}`;
  const post = await Post.findOne({ pathname }).exec();

  if (!post) {
    ctx.status = 404;
  } else {
    ctx.body = post;
  }
};
