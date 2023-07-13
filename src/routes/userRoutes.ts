import * as express from 'express';

import { UserRole } from '@fabiant1498/llovizna-blog';

import { upload } from '../config/multerConfig';

import {
  createUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
} from './../controllers/userController';

import { verifyToken, verifyRole } from './../middleware/authMiddleware';

const router = express.Router();

router.use(verifyToken, verifyRole(['superadmin', 'admin']));

router.route('/').post(upload.single('picture'), createUser).get(getUsers);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default router;
