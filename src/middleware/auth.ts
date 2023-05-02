import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export default (req: Request, res: Response, next: any) => {
  const tokenKey: string | undefined = process.env.TOKEN_KEY;
  const key: string = tokenKey || "default";

  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, key);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};
