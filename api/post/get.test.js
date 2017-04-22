const Post = require('../models/Post');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index.js');

chai.should();
chai.use(chaiHttp);

describe('Get post', () => {
  beforeEach(async () => {
    await Post.remove();
  });

  it('Should retrieve a post.', async () => {
    const newPost = await chai.request(server).post('/post/create/');
    const reqPost = await chai.request(server).get('/post/get' + newPost.body.pathname);

    reqPost.should.have.status(200);
    reqPost.should.have.property('body');
  });

  it('Should return 404 if post does not exist.', async () => {
    try {
      await chai.request(server).get('/post/get/asdasdasd');
    } catch (err) {
      err.should.have.status(404);
      err.should.not.have.property('body');
    }
  });
});
