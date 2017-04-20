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

  it('It should return the newly created post', async () => {
    const newPost = await chai.request(server).post('/post/create/');
    newPost.should.have.status(200);
    newPost.should.have.property('body');
    newPost.body.should.have.property('_id');
    newPost.body.should.have.property('slug');
    newPost.body.should.have.property('title').eql(newPost.body._id);
    newPost.body.should.have.property('pathname').eql(`/${newPost.body._id}/`);
  });
});
