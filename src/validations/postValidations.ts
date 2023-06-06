import * as Joi from 'joi';

import { validator } from './validator';
import Post from '@models/typings/post.interface';

const createPostSchema = Joi.object<Post>({
  location: Joi.string().optional(),
  description: Joi.string().max(200).optional(),
});

const getUserPostSchema = Joi.object({
  userId: Joi.string().hex().length(24).required(),
});

const likePostSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

const validateCreatePost = validator<Post>(createPostSchema);
const validateGetUserPost = validator(getUserPostSchema);
const validateLikePost = validator(likePostSchema);

export { validateCreatePost, validateGetUserPost, validateLikePost };
