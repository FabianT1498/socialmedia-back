import { Schema, model, Types } from 'mongoose';
import CommentSchema from './typings/commentSchema.interface';

const commentSchema = new Schema<CommentSchema>(
  {
    authorId: { type: Schema.Types.ObjectId, required: true },
    postId: { type: Schema.Types.ObjectId, required: true },
    likes: { type: Schema.Types.Map, required: true },
    parentComment: {
      type: Schema.Types.ObjectId,
      required: false,
      default: null,
    },
    content: { type: Schema.Types.String, required: true },
  },
  { timestamps: false }
);

export default model<CommentSchema>('comment', commentSchema);
