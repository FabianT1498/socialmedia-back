import { Schema, model } from 'mongoose';
import PostSchema from './typings/postSchema.interface';

const postSchema = new Schema<PostSchema>(
  {
    title: {
      type: Schema.Types.String,
      required: true,
    },
    content: {
      type: String,
      default: '',
    },
    authorId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    createdAt: {
      type: Schema.Types.Date,
      required: true,
    },
    updatedAt: {
      type: Schema.Types.Date,
      required: true,
    },
    tags: {
      type: [Schema.Types.String],
      required: false,
    },
    images: {
      type: [Schema.Types.String],
      required: false,
    },
    category: {
      type: String,
      default: '',
      required: true,
    },
    featuredImage: {
      type: String,
      default: '',
      required: false,
    },
  },

  { timestamps: true }
);

export default model<PostSchema>('post', postSchema);
