import Post from '../models/Post';

const titleToSlug = (str) =>
  str.toLowerCase().replace(/[^a-z0-9]/, '-');

// Recursively checks if a slug is unique for the given parent post.
const getSlug = (slug, parent, id, index = 1) => {
  return new Promise((resolve, reject) => {
    Post
      .findOne({ parent: parent, slug: slug })
      .exec((err, post) => {
        if (err) {
          reject(err);
        } else if (!post || post._id.toString() === id) {
          resolve(slug);
        } else {
          getSlug(`${slug}-${index}`, parent, id, index + 1).then(resolve, reject);
        }
      });
  });
};

// Recursively gets all parents posts and builds a pathstring.
const getPathname = (currentPost, pathname = '') => {
  return new Promise((resolve, reject) => {
    if (!currentPost.parent) {
      resolve(`/${currentPost.slug}/${pathname}`);
    } else {
      Post
        .findOne({ _id: currentPost.parent })
        .exec((err, post) => {
          if (err) {
            reject(err);
          } else {
            getPathname(post, `${currentPost.slug}/${pathname}`).then(resolve, reject);
          }
        });
    }
  });
};

export default (req, res) => {
  console.log(req.body);
  if (!req.body) {
    res.status(500).send('Missing request body.');
  } else if (!req.body.id) {
    res.status(500).send('No post id provided.');
  } else {
    Post
      .findOne({ _id: req.body.id })
      .exec((getErr, post) => {
        if (getErr) {
          // Error requesting post.
          res.status(500).send(getErr);
        } else if (!post) {
          // Post not found.
          res.status(404).send();
        } else {
          const id = post._id.toString();

          // Set new slug if provided.
          if (req.body.slug) {
            post.slug = req.body.slug;
          }

          // Set new title if provided. If no slug was provided,
          // set the slug to a parsed version of the title.
          if (req.body.title) {
            post.title = req.body.title;

            if (post.slug === id) {
              post.slug = titleToSlug(post.title);
            }
          }

          // Set new status if provided. Make sure only
          // "draft" and "published" is accepted.
          if (req.body.status === 'draft' || req.body.status === 'published') {
            post.status = req.body.status;
          }

          // Set new parent, if parent is provided.
          if (req.body.parent && req.body.parent !== id) {
            post.parent = req.body.parent;
          }

          // Always make sure the slug is unique for the parent.
          getSlug(post.slug, post.parent, post._id.toString()).then(newSlug => {
            post.slug = newSlug;
            getPathname(post).then(newPathname => {
              post.pathname = newPathname;
              post.save(saveErr => {
                if (saveErr) {
                  res.status(500).send(saveErr);
                } else {
                  res.send(post);
                }
              }, (parseErr) => {
                res.status(500).send(parseErr);
              });
            });
          });
        }
      });
  }
};
