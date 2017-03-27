import { Schema, model } from 'mongoose';

const ModuleSchema = new Schema({
  type: String
}, { strict: false });

export default model('Module', ModuleSchema);
