import * as express from 'express';

import { createPost, getUserPosts, getFeedPosts, likePost } from '@controllers/postController';

import { verifyToken } from './../middleware/authMiddleware';

import { upload } from '../config/multerConfig';

const router = express.Router();

// CREATE
router.route('/').post(verifyToken, upload.single('picture'), createPost);

// READ
router.route('/').get(verifyToken, getFeedPosts);
router.route('/:userId/posts').get(verifyToken, getUserPosts);

// UPDATE
router.route('/:id/like').patch(verifyToken, likePost);

export default router;
