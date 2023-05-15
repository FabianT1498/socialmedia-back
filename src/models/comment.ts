import { Schema, model, Types } from "mongoose";
import Comment from "./typings/comment.interface";

const commentSchema = new Schema<Comment>(
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

export default model<Comment>("comment", commentSchema);
