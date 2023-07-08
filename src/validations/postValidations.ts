import * as Joi from 'joi';

import { validator } from './validator';
import { Models } from '@fabiant1498/llovizna-blog';

const createPostSchema = Joi.object<Models.Post>({
  title: Joi.string().max(150).required(),
  content: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).optional(),
  category: Joi.string().required(),
  images: Joi.array().items(Joi.string()).optional(),
  featuredImage: Joi.string().optional(),
});

const getUserPostSchema = Joi.object({
  userId: Joi.string().hex().length(24).required(),
});

const likePostSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

const validateCreatePost = validator<Models.Post>(createPostSchema);
const validateGetUserPost = validator(getUserPostSchema);
const validateLikePost = validator(likePostSchema);

export { validateCreatePost, validateGetUserPost, validateLikePost };
