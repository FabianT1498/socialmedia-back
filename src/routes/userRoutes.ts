import * as express from "express";

import {
  getUser,
  getUserFriends,
  addRemoveFriend,
} from "./../controllers/userController";

import { verifyToken } from "./../middleware/auth";

import { upload } from "../config/multerConfig";

const router = express.Router();

// READ
router.route("/:id").get(verifyToken, getUser);
router.route("/:id/friends").get(verifyToken, getUserFriends);

// UPDATE
router.patch("/:friendId", verifyToken, addRemoveFriend);

export default router;
