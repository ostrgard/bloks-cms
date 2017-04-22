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
});
