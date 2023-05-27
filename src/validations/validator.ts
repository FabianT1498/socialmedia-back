import { ObjectSchema } from "joi";

const validator =
  <T>(schema: ObjectSchema<T>) =>
  (payload: T) =>
    schema.validate(payload, { abortEarly: false });

export { validator };
