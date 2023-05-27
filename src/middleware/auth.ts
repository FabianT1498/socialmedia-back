import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";

import User from "@models/typings/user.interface";
import UserModel from "@models/user";

import catchAsync from "./../utils/catchAsync";

export const verifyToken = catchAsync(
  async (req: Request, res: Response, next: any) => {
    const tokenKey: string | undefined = process.env.TOKEN_KEY;
    const key: string = tokenKey || "default";

    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
      return res.status(403).send("A token is required for authentication");
    }

    try {
      const decoded = jwt.verify(token, key);

      if (decoded && typeof decoded === "object") {
        const user: User | null = await UserModel.findById(decoded.userId);
        req.user = user ?? undefined;
      }
    } catch (err) {
      return res.status(401).send("Invalid Token");
    }
    return next();
  }
);
