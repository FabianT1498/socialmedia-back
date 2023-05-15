import { Request, Response } from "express";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

import catchAsync from "./../utils/catchAsync";
import UserModel from "./../models/user";

const register = catchAsync(async (req: Request, res: Response) => {
  // Our register logic starts here
  try {
    // Get user input
    const data = req.body ?? new ReadableStream<Uint8Array>();

    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      location,
      occupation,
    } = data;

    // Validate user input
    if (
      !(email && password && firstName && lastName && location && occupation)
    ) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await UserModel.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await UserModel.create({
      firstName,
      lastName,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
      location,
      occupation,
    });

    const tokenKey: string | undefined = process.env.TOKEN_KEY;
    const key: string = tokenKey || "default";

    // Create token
    const token = jwt.sign({ user_id: user._id, email }, key, {
      algorithm: "HS256",
      expiresIn: "2h",
    });

    // save user token
    user.token = token;

    // return new user
    res.status(201).json(user);
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

const login = catchAsync(async (req: any, res: any) => {
  // Our login logic starts here
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await UserModel.findOne({ email });
    const tokenKey: string | undefined = process.env.TOKEN_KEY;
    const key: string = tokenKey || "default";

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign({ user_id: user._id, email }, key, {
        expiresIn: "2h",
      });

      // save user token
      user.token = token;

      // user
      res.status(200).json(user);
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

export { register, login };
