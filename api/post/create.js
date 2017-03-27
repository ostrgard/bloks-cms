import Post from '../models/Post';

export default async (req, res) => {
  try {
    const post = new Post();
    post.slug = post._id;
    post.title = post._id;
    post.pathname = `/${post._id}/`;
    post.status = 'draft';
    await post.save();
    res.send(post);
  } catch (error) {
    res.status(500).send();
  }
};
