const Post = require('../models/Post');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index.js');

chai.should();
chai.use(chaiHttp);

describe('Get posts', () => {
  beforeEach(async () => {
    await Post.remove();
  });

  it('Should retrieve an empty list if there\'s no posts.', async () => {
    const posts = await chai.request(server).get('/posts/');

    posts.should.have.status(200);
    posts.should.have.property('body');
    posts.body.should.have.lengthOf(0);
  });

  it('Should retrieve a list of posts.', async () => {
    await chai.request(server).post('/post/create/');
    await chai.request(server).post('/post/create/');
    await chai.request(server).post('/post/create/');
    const posts = await chai.request(server).get('/posts/');

    posts.should.have.status(200);
    posts.should.have.property('body');
    posts.body.should.have.lengthOf(3);
  });

  it('Should should nest children', async () => {
    const parent = await chai.request(server).post('/post/create/');

    await chai.request(server).post('/post/update/').send({
      id: parent.body._id,
      parent: (await chai.request(server).post('/post/create/')).body._id
    });

    await chai.request(server).post('/post/update/').send({
      id: (await chai.request(server).post('/post/create/')).body._id,
      parent: parent.body._id
    });

    await chai.request(server).post('/post/update/').send({
      id: (await chai.request(server).post('/post/create/')).body._id,
      parent: parent.body._id
    });

    const posts = await chai.request(server).get('/posts/');
    posts.should.have.status(200);
    posts.body.should.have.lengthOf(1);
    posts.body[0].children.should.have.lengthOf(1);
    posts.body[0].children[0].children.should.have.lengthOf(2);
  });
});
