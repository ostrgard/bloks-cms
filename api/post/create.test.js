const Post = require('../models/Post');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index.js');

chai.should();
chai.use(chaiHttp);

describe('Create post', () => {
  beforeEach(async () => {
    await Post.remove();
  });

  it('Should return a newly created post', async () => {
    const post = await chai.request(server).post('/post/create/');
    post.should.have.status(200);
    post.should.have.property('body');
    post.body.should.have.property('_id');
    post.body.should.have.property('slug');
  });

  it('First post created should have pathname "/" and root true', async () => {
    const post1 = await chai.request(server).post('/post/create/');
    post1.should.have.status(200);
    post1.should.have.property('body');
    post1.body.root.should.be.true; // eslint-disable-line
    post1.body.should.have.property('pathname').eql(`/`);

    const post2 = await chai.request(server).post('/post/create/');
    post2.should.have.status(200);
    post2.should.have.property('body');
    post2.body.should.have.property('pathname').eql(`/${post2.body._id}/`);
  });
});
