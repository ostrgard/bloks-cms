import Post from '../models/Post';

const nestChildren = (posts) => {
  const p = posts.map(n => n.toObject());

  p.filter(n => n.parent).forEach(n => {
    const parentIndex = p.findIndex(nn => nn._id.toString() === n.parent.toString());

    if (parentIndex >= 0) {
      if (p[parentIndex].children) {
        p[parentIndex].children.push(n);
      } else {
        p[parentIndex].children = [n];
      }
    }
  });

  return p.filter(n => !n.parent);
};

export default async ctx => {
  const posts = await Post.find().exec();
  ctx.body = nestChildren(posts);
};
