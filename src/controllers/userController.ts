import { Request, Response } from "express";
import { Types } from "mongoose";

import catchAsync from "./../utils/catchAsync";
import User from "@app/models/typings/user.interface";
import UserModel from "@models/user";

import { validateGetUser } from "@validations/userValidations";

const formatFriends = (arr: User[]) =>
  arr.map(
    ({ _id, firstName, lastName, occupation, location, picturePath }: User) => {
      return {
        _id,
        firstName,
        lastName,
        occupation,
        location,
        picturePath,
      };
    }
  );

const getUser = catchAsync(async (req: Request, res: Response) => {
  // Our register logic starts here
  try {
    // Get user input
    const data = req.params ?? {};

    const { error, value } = validateGetUser(data);

    if (error) {
      return res.status(400).send(error.details);
    }

    const user = await UserModel.findById(data.id);
    res.status(200).json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

const getUserFriends = catchAsync(async (req: Request, res: Response) => {
  // Our register logic starts here
  try {
    // Get user input
    const data = req.params ?? {};

    const { error, value } = validateGetUser(data);

    if (error) {
      return res.status(400).send(error.details);
    }

    const user: User | null = await UserModel.findById(data.id);

    const friends =
      user &&
      (await UserModel.find({
        _id: { $in: user.friends },
      }));

    const formattedFriends = friends && formatFriends(friends);

    res.status(200).json(formattedFriends);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
const addRemoveFriend = catchAsync(async (req: Request, res: Response) => {
  try {
    let data = req.body ?? {};

    let friendData = { id: data.friendId };

    const { error, value } = validateGetUser(friendData);

    if (error) {
      return res.status(400).send(error.details);
    }

    if (req.user) {
      const friend = await UserModel.findById(friendData.id);

      if (!friend) {
        return res
          .status(400)
          .json({ status: 400, message: "Friend doesn't exist" });
      }

      const user = await UserModel.findById(req.user._id);

      if (user) {
        if (friendData.id === user._id.toString()) {
          return res.status(400).json({
            status: 400,
            message: "You can't add or delete to yourself as friend",
          });
        }

        const index = user.friends.findIndex(
          ({ _id }: Types.ObjectId) => _id.toString() === friendData.id
        );

        if (index !== -1) {
          user.friends.splice(index, 1);
        } else {
          user.friends.push(new Types.ObjectId(friendData.id));
        }

        await user?.save();

        const friends = await UserModel.find({
          _id: { $in: user.friends },
        });

        return res.status(200).json(formatFriends(friends));
      }
    }
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
});

export { getUser, getUserFriends, addRemoveFriend };
