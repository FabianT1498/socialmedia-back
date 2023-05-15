import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";

import User from "@models/typings/user.interface";

export const verifyToken = (req: Request, res: Response, next: any) => {
  const tokenKey: string | undefined = process.env.TOKEN_KEY;
  const key: string = tokenKey || "default";

  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, key);

    if (typeof decoded === "object" && decoded !== null) {
      const user: User = decoded as User;
      req.user = user;
    }
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};
