import Post from '../models/Post';

export default async (req, res) => {
  try {
    const pathname = `/${req.params[0].replace(/^\/|\/$/g, '')}/`;
    const post = await Post.findOne({ pathname }).exec();
    if (!post) {
      res.status(404).send();
    } else {
      res.send(post);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
};

// export default (req, res) => {
//   const pathname = `/${req.params[0].replace(/^\/|\/$/g, '')}/`;

//   Post
//     .findOne({ pathname })
//     .exec((err, post) => {
//       if (err) {
//         res.status(500).send(err);
//       } else if (!post) {
//         res.status(404).send();
//       } else {
//         res.send(post);
//       }
//     });
// };
