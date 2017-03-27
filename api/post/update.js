import Post from '../models/Post';

// Recursively checks if a slug is unique for the given parent post.
async function getSlug(s, parent, id, index = 0) {
  // Sanitize the slug
  const slug = s.toLowerCase().replace(/[^a-z0-9]/, '-');
  // If not the first iteration, add or increment the postfixed index.
  let newSlug = index === 0 ? slug : `${slug}-${index}`;
  // Query for a post matching the slug we're trying to use.
  const post = await Post.findOne({ parent: parent, slug: newSlug }).exec();

  // Non-base-case: If a post exists and it's not the current post, try again.
  if (post && post._id.toString() !== id) {
    newSlug = await getSlug(slug, parent, id, index + 1);
  }

  return newSlug;
}

// getSlug('Tests', '58bda478e9df5e0bef97886c', '58bdbd4a2126840e4bdbecd0').then(console.log);

// Recursively gets all parents posts and builds a pathstring.
async function getPathname(currentPost, pathname = '') {
  let newPathname = `/${currentPost.slug}/${pathname}`;

  // Non-base-case:
  if (currentPost.parent) {
    const parent = await Post.findOne({ _id: currentPost.parent }).exec();
    newPathname = await getPathname(parent, `${currentPost.slug}/${pathname}`);
  }

  return newPathname;
}

// getPathname({
//   _id: '58bdbd4a2126840e4bdbecd0',
//   pathname: '/root/tests/testsasdasd/',
//   slug: 'testsasdasd',
//   __v: 0,
//   parent: '58bda452e9df5e0bef97886b',
//   title: 'Lorem ipsum',
//   modules: []
// }).then(console.log);

export default async (req, res) => {
  if (!req.body) {
    res.status(500).send('Missing request body.');
  } else if (!req.body.id) {
    res.status(500).send('No post id provided.');
  } else {
    try {
      const post = await Post.findOne({ _id: req.body.id }).exec();

      if (!post) {
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
            post.slug = post.title;
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

        post.slug = await getSlug(post.slug, post.parent, post._id.toString());
        post.pathname = await getPathname(post);
        await post.save();
        res.send(post);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send();
    }
  }
};
