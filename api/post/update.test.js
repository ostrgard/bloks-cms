const Post = require('../models/Post');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index.js');

chai.should();
chai.use(chaiHttp);

describe('Update post', () => {
  beforeEach(async () => {
    await Post.remove();
  });

  it('Should return an updated post.', async () => {
    const newPost = await chai.request(server).post('/post/update/').send({
      id: (await chai.request(server).post('/post/create/')).body._id
    });

    newPost.should.have.status(200);
    newPost.should.have.property('body');
    newPost.body.should.have.property('_id');
    newPost.body.should.have.property('slug');
  });

  it('Should return 404 if id is missing or does not exist.', async () => {
    try {
      await chai.request(server).post('/post/update/').send({ id: 'asdasd' });
    } catch (err) {
      err.should.have.status(404);
      err.should.not.have.property('body');
    }

    try {
      await chai.request(server).post('/post/update/');
    } catch (err) {
      err.should.have.status(404);
      err.should.not.have.property('body');
    }
  });

  it('Should update title as well as slug, if slug have not been set.', async () => {
    const newPost = await chai.request(server).post('/post/update/').send({
      id: (await chai.request(server).post('/post/create/')).body._id,
      title: 'Foo Bar'
    });

    newPost.should.have.status(200);
    newPost.should.have.property('body');
    newPost.body.title.should.equal('Foo Bar');
    newPost.body.slug.should.equal('foo-bar');
    newPost.body.pathname.should.equal('/foo-bar/');
  });

  it('Should update slug and mutate to unique slug per parent, but prepending and incremending index.', async () => {
    await chai.request(server).post('/post/update/').send({
      id: (await chai.request(server).post('/post/create/')).body._id,
      title: 'Foo Bar'
    });

    const newPost1 = await chai.request(server).post('/post/update/').send({
      id: (await chai.request(server).post('/post/create/')).body._id,
      title: 'Foo Bar'
    });

    newPost1.body.slug.should.equal('foo-bar-2');
    newPost1.body.pathname.should.equal('/foo-bar-2/');

    const newPost2 = await chai.request(server).post('/post/update/').send({
      id: (await chai.request(server).post('/post/create/')).body._id,
      title: 'Foo Bar'
    });

    newPost2.body.slug.should.equal('foo-bar-3');
    newPost2.body.pathname.should.equal('/foo-bar-3/');
  });

  it('Should be able to be assigned to a parent.', async () => {
    const parent = await chai.request(server).post('/post/update/').send({
      id: (await chai.request(server).post('/post/create/')).body._id,
      title: 'Foo'
    });

    const newPost = await chai.request(server).post('/post/update/').send({
      id: (await chai.request(server).post('/post/create/')).body._id,
      title: 'Bar',
      parent: parent.body._id
    });

    newPost.body.slug.should.equal('bar');
    newPost.body.pathname.should.equal('/foo/bar/');
  });

  it('Should reevaluate slug when being assigned to a parent.', async () => {
    const parent = await chai.request(server).post('/post/update/').send({
      id: (await chai.request(server).post('/post/create/')).body._id,
      title: 'Foo'
    });

    await chai.request(server).post('/post/update/').send({
      id: (await chai.request(server).post('/post/create/')).body._id,
      title: 'Bar',
      parent: parent.body._id
    });

    const newPost = await chai.request(server).post('/post/update/').send({
      id: (await chai.request(server).post('/post/create/')).body._id,
      title: 'Bar',
      parent: parent.body._id
    });

    newPost.body.slug.should.equal('bar-2');
    newPost.body.pathname.should.equal('/foo/bar-2/');
  });

  it('Should update childrens pathnames when parent slug changes.', async () => {
    const parent = await chai.request(server).post('/post/update/').send({
      id: (await chai.request(server).post('/post/create/')).body._id,
      title: 'Foo'
    });

    await chai.request(server).post('/post/update/').send({
      id: (await chai.request(server).post('/post/create/')).body._id,
      title: 'Bar',
      parent: parent.body._id
    });

    await chai.request(server).post('/post/update/').send({
      id: parent.body._id,
      slug: 'baz'
    });

    const post = await chai.request(server).get('/post/get/baz/bar/');

    post.should.have.status(200);
    post.should.have.property('body');
    post.body.title.should.equal('Bar');
  });

  it('Should not allow making a post a child of it\'s children recursivly', async () => {
    let parent = await chai.request(server).post('/post/create/');
    const child = await chai.request(server).post('/post/create/');
    const child2 = await chai.request(server).post('/post/create/');

    await chai.request(server).post('/post/update/').send({
      id: child.body._id,
      parent: parent.body._id
    });

    await chai.request(server).post('/post/update/').send({
      id: child2.body._id,
      parent: parent.body._id
    });

    parent = await chai.request(server).post('/post/update/').send({
      id: parent.body._id,
      parent: child2.body._id
    });

    parent.should.have.status(200);
    parent.should.have.property('body');
    parent.body.should.not.have.property('parent');
  });

  it('Should be able to unset a parent', async () => {
    const parent = await chai.request(server).post('/post/create/');
    let child = await chai.request(server).post('/post/create/');

    child = await chai.request(server).post('/post/update/').send({
      id: child.body._id,
      parent: parent.body._id
    });

    child.should.have.status(200);
    child.should.have.property('body');
    child.body.should.have.property('parent');

    child = await chai.request(server).post('/post/update/').send({
      id: child.body._id,
      parent: 'unset'
    });

    child.should.have.status(200);
    child.should.have.property('body');
    child.body.should.not.have.property('parent');
  });
});
