import { Request, Response } from "express";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

import catchAsync from "./../utils/catchAsync";
import UserModel from "./../models/user";
import User from "@models/typings/user.interface";

import { validateSignUp, validateLogin } from "@validations/authValidations";

const register = catchAsync(async (req: Request, res: Response) => {
  // Our register logic starts here
  try {
    // Get user input
    const data: User = req.body ?? {};

    const { error, value } = validateSignUp(data);

    // Validate user input
    if (error) {
      return res.status(400).send(error.details);
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await UserModel.findOne({ email: data.email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    const encryptedPassword = await bcrypt.hash(data.password, 10);

    // Create user in our database
    const user = await UserModel.create({
      ...data,
      email: data.email.toLowerCase(),
      password: encryptedPassword,
    });

    const tokenKey: string | undefined = process.env.TOKEN_KEY;
    const key: string = tokenKey || "default";

    // Create token
    const token = jwt.sign(
      { userId: user._id, email: data.email.toLowerCase() },
      key,
      {
        algorithm: "HS256",
        expiresIn: "2h",
      }
    );

    // save user token
    user.token = token;

    // return new user
    res.status(201).json(user);
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

const login = catchAsync(async (req: Request, res: Response) => {
  // Our login logic starts here
  try {
    const data: User = req.body ?? {};

    const { value, error } = validateLogin(data);

    // Get user input
    if (error) {
      return res.status(400).send(error.details);
    }

    // Validate if user exist in our database
    const user = await UserModel.findOne({ email: data.email.toLowerCase() });
    const tokenKey: string | undefined = process.env.TOKEN_KEY;
    const key: string = tokenKey || "default";

    if (user && (await bcrypt.compare(data.password, user.password))) {
      // Create token
      const token = jwt.sign(
        { userId: user._id, email: data.email.toLowerCase() },
        key,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;

      // user
      return res.status(200).json(user);
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

export { register, login };
