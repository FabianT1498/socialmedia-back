import { Schema, model } from "mongoose";
import User from "./user.interface";

const userSchema = new Schema<User>({
  firstName: { type: String, required: true, default: null },
  lastName: { type: String, required: true, default: null },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token: { type: String, requierd: true },
});

export default model<User>("user", userSchema);
