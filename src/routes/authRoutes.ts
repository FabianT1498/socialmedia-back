import * as express from "express";

import { login, register } from "./../controllers/authController";
import { upload } from "../config/multerConfig";

const router = express.Router();

router.route("/register").post(upload.single("picture"), register);

router.route("/login").post(login);

export default router;
