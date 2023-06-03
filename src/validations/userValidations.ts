import * as Joi from "joi";

import { validator } from "./validator";

const getUserSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

const validateGetUser = validator(getUserSchema);
// const validateLogin = validator<User>(loginSchema);

export { validateGetUser };
