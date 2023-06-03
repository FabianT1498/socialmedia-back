import * as Joi from "joi";

import {validator} from "./validator";
import Post from "@models/typings/post.interface";

const createPostSchema = Joi.object<Post>({
  location: Joi.string().optional(),
  description: Joi.string().max(200).optional(),
});

const validateCreatePost = validator<Post>(createPostSchema);

export {validateCreatePost};
