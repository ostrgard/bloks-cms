import Post from '../models/Post';

export default async ctx => {
  const posts = await Post.find().exec();
  ctx.body = posts;
};
