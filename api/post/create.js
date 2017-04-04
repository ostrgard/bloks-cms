import Post from '../models/Post';

export default async ctx => {
  const post = new Post();
  post.slug = post._id;
  post.title = post._id;
  post.pathname = `/${post._id}/`;
  post.status = 'draft';
  await post.save();
  ctx.body = post;
};
