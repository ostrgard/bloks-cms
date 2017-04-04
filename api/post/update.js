import Post from '../models/Post';

// Recursively checks if a slug is unique for the given parent post.
async function getSlug(s, parent, id, index = 0) {
  // Sanitize the slug
  const slug = s.toLowerCase().replace(/[^a-z0-9]/g, '-');
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

async function updateChildren(id) {
  const posts = await Post.find({ parent: id }).exec();

  posts.forEach(async post => {
    post.pathname = await getPathname(post);
    await post.save();
    await updateChildren(post._id.toString());
  });
}

export default async ctx => {
  const body = ctx.request.body;

  if (!body.id) {
    ctx.status = 500;
    ctx.body = 'No post id provided.';
  } else {
    const post = await Post.findOne({ _id: body.id }).exec();

    if (!post) {
      ctx.status = 404;
    } else {
      const id = post._id.toString();

      // Set new slug if provided.
      if (body.slug) {
        post.slug = body.slug;
      }

      // Set new title if provided. If no slug was provided,
      // set the slug to a parsed version of the title.
      if (body.title) {
        post.title = body.title;

        if (post.slug === id) {
          post.slug = post.title;
        }
      }

      // Set new status if provided. Make sure only
      // "draft" and "published" is accepted.
      if (body.status === 'draft' || body.status === 'published') {
        post.status = body.status;
      }

      // Set new parent, if parent is provided.
      if (body.parent && body.parent !== id) {
        post.parent = body.parent;
      }

      post.slug = await getSlug(post.slug, post.parent, post._id.toString());
      post.pathname = await getPathname(post);
      await post.save();
      await updateChildren(post._id.toString());
      ctx.body = post;
    }
  }
};
