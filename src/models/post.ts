import { Schema, model } from "mongoose";
import Post from "./typings/post.interface";

const PostSchema = new Schema<Post>(
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
      default: "",
    },
    location: String,
    likes: { type: Schema.Types.Map, required: true, default: {} },
  },

  { timestamps: true }
);

export default model<Post>("post", PostSchema);
