import { Request, Response } from "express";
import { Types } from "mongoose";

import catchAsync from "./../utils/catchAsync";
import Post from "@models/typings/post.interface";
import PostModel from "@models/post";

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

const createPost = catchAsync(async (req: Request, res: Response) => {
  // Our register logic starts here
  try {
    // Get user input
    const data = req.params ?? new ReadableStream<Uint8Array>();
    const { id } = data;
    const user = await UserModel.findById(id);
    res.status(200).json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

const getFeedPosts = catchAsync(async (req: Request, res: Response) => {
  // Our register logic starts here
  try {
    // Get user input
    const data = req.params ?? new ReadableStream<Uint8Array>();
    const { id } = data;
    const user: User | null = await UserModel.findById(id);

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
const getUserPosts = catchAsync(async (req: Request, res: Response) => {
  try {
    const data = req.params ?? new ReadableStream<Uint8Array>();
    const { friendId } = data;

    const user = req.user && (await UserModel.findById(req.user._id));

    const friendObjId: Types.ObjectId = new Types.ObjectId(friendId);

    if (user && Types.ObjectId.isValid(friendId)) {
      const index = user.friends.findIndex(
        ({ _id }: Types.ObjectId) => _id === friendObjId
      );

      if (index !== -1) {
        user.friends?.splice(index, 1);
      } else {
        user.friends.push(friendObjId);
      }

      await user.save();

      const friends =
        user &&
        (await UserModel.find({
          _id: { $in: user.friends },
        }));

      return res.status(200).json(formatFriends(friends));
    }

    return res.status(404).json({
      message:
        "ID parameter is missing or malformed. Please check your request.",
    });
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
});

const likePost = () => {};

export { createPost, getFeedPosts, getUserPosts, likePost };
