import { Schema, model } from 'mongoose';
import PostSchema from './typings/postSchema.interface';

const postSchema = new Schema<PostSchema>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    picturePath: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    location: String,
    likes: { type: Schema.Types.Map, required: true, default: {} },
  },

  { timestamps: true }
);

export default model<PostSchema>('post', postSchema);
