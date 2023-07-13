import { Request, Response } from 'express';
import { Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { UserRole, User } from '@fabiant1498/llovizna-blog';

import { createResponse } from '@utils/createResponse';
import catchAsync from './../utils/catchAsync';
import { uploadDirUrl } from '../config/multerConfig';

import UserModel from '@models/user';

import { validateGetUser, validateCreateUser } from '@validations/userValidations';

// const formatFriends = (arr: Models.User[]) =>
//   arr.map(({ _id, firstName, lastName, occupation, location, picturePath }: Models.User) => {
//     return {
//       _id,
//       firstName,
//       lastName,
//       occupation,
//       location,
//       picturePath,
//     };
//   });

const createUser = catchAsync(async (req: Request, res: Response) => {
  try {
    // Get user input
    const data: User = req.body ?? {};

    if (req.user) {
      if (
        req.user.role === 'admin' &&
        (['superadmin', 'admin'] as UserRole[]).includes(data.role)
      ) {
        return res.status(400).json(
          createResponse(false, null, {
            code: 400,
            message: "You don't have allowed to create another admin users",
          })
        );
      }

      const { error, value } = validateCreateUser(data);

      if (error) {
        console.log(error.details.map((errDetail) => errDetail.type));
        return res.status(400).json(
          createResponse(false, null, {
            code: 400,
            message: error.details.map((err) => err.message),
          })
        );
      }

      const file = req.file;
      let fileUrl: string = '';

      if (file) {
        fileUrl = `${uploadDirUrl.profile}/${file.filename}`;
      }

      //Encrypt user password
      const encryptedPassword = await bcrypt.hash(data.password, 10);

      const user: User = {
        ...data,
        picturePath: fileUrl,
        password: encryptedPassword,
      };

      const newUser = new UserModel(user);

      await newUser.save();

      res.status(201).json(createResponse<User>(true, user, null));
    }
  } catch (err: any) {
    return res.status(400).json(
      createResponse(false, null, {
        code: 400,
        message: err.message,
      })
    );
  }
});

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

// const getUserFriends = catchAsync(async (req: Request, res: Response) => {
//   // Our register logic starts here
//   try {
//     // Get user input
//     const data = req.params ?? {};

//     const { error, value } = validateGetUser(data);

//     if (error) {
//       return res.status(400).send(error.details);
//     }

//     const user: User | null = await UserModel.findById(data.id);

//     const friends =
//       user &&
//       (await UserModel.find({
//         _id: { $in: user.friends },
//       }));

//     const formattedFriends = friends && formatFriends(friends);

//     res.status(200).json(formattedFriends);
//   } catch (err: any) {
//     res.status(500).json({ error: err.message });
//   }
// });

// UPDATE
// const addRemoveFriend = catchAsync(async (req: Request, res: Response) => {
//   try {
//     let data = req.body ?? {};

//     let friendData = { id: data.friendId };

//     const { error, value } = validateGetUser(friendData);

//     if (error) {
//       return res.status(400).send(error.details);
//     }

//     if (req.user) {
//       const friend = await UserModel.findById(friendData.id);

//       if (!friend) {
//         return res.status(400).json({ status: 400, message: "Friend doesn't exist" });
//       }

//       const user = await UserModel.findById(req.user._id);

//       if (user) {
//         if (friendData.id === user._id.toString()) {
//           return res.status(400).json({
//             status: 400,
//             message: "You can't add or delete to yourself as friend",
//           });
//         }

//         const index = user.friends.findIndex(
//           ({ _id }: Types.ObjectId) => _id.toString() === friendData.id
//         );

//         if (index !== -1) {
//           user.friends.splice(index, 1);
//         } else {
//           user.friends.push(new Types.ObjectId(friendData.id));
//         }

//         await user?.save();

//         const friends = await UserModel.find({
//           _id: { $in: user.friends },
//         });

//         return res.status(200).json(formatFriends(friends));
//       }
//     }
//   } catch (err: any) {
//     res.status(404).json({ message: err.message });
//   }
// });

// const getAuthUser = (req: Request, res: Response) => {
//   const user = req.user;
//   const response = createResponse(true, user, null);

//   res.status(200).json(response);
// };

const getUsers = catchAsync(async (req: Request, res: Response) => {});

const updateUser = catchAsync(async (req: Request, res: Response) => {});

const deleteUser = catchAsync(async (req: Request, res: Response) => {});

export { createUser, getUsers, getUser, updateUser, deleteUser };
