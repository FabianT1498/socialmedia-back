import { Schema, model } from 'mongoose';
import UserSchema from './typings/userSchema.interface';

const userSchema = new Schema<UserSchema>(
  {
    firstName: { type: String, required: true, default: null },
    lastName: { type: String, required: true, default: null },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    picturePath: {
      type: String,
      default: '',
    },
    friends: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
    location: String,
    occupation: String,
    viewedProfile: Number,
    impressions: Number,
    token: { type: String, required: false },
  },

  { timestamps: true }
);

export default model<UserSchema>('user', userSchema);
