import Post from '../models/Post';

export default (req, res) => {
  Post
    .find()
    .exec((err, post) => {
      if (err) {
        res.status(500).send(err);
      } else if (!post) {
        res.status(404).send();
      } else {
        res.send(post);
      }
    });
};
