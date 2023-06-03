import * as Joi from "joi";

import User from "@models/typings/user.interface";

import { validator } from "./validator";

const signUpSchema = Joi.object<User>({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(3).max(10).required(),
  occupation: Joi.string().min(3).required(),
  location: Joi.string().min(3).required(),
});

const loginSchema = Joi.object<User>({
  email: Joi.string().email().required(),
  password: Joi.string().min(3).max(10).required(),
});

const validateSignUp = validator<User>(signUpSchema);
const validateLogin = validator<User>(loginSchema);

export { validateSignUp, validateLogin };
