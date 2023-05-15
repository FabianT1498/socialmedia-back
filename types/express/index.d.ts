import User from "@models/typings/user.interface";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
