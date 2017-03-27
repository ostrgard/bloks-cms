import { Schema, model } from 'mongoose';

const PostSchema = new Schema({
  title: String,
  slug: String,
  pathname: String,
  modules: [{
    type: Schema.Types.ObjectId,
    ref: 'Module'
  }],
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }
});

export default model('Post', PostSchema);
