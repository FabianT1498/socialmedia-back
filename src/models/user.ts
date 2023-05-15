import { Schema, model, Types } from "mongoose";
import User from "./typings/user.interface";

const userSchema = new Schema<User>(
  {
    firstName: { type: String, required: true, default: null },
    lastName: { type: String, required: true, default: null },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    picturePath: {
      type: String,
      default: "",
    },
    friends: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
    location: String,
    occupation: String,
    viewedProfile: Number,
    impressions: Number,
    token: { type: String, required: true },
  },

  { timestamps: true }
);

export default model<User>("user", userSchema);
