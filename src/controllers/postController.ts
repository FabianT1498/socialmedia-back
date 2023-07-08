import { Request, Response } from 'express';
import { Types } from 'mongoose';

import { Models } from '@fabiant1498/llovizna-blog';
import { createResponse } from '@utils/createResponse';
import catchAsync from '@utils/catchAsync';
import { paginate } from '@utils/paginate';

import PostModel from '@models/post';

import {
  validateCreatePost,
  validateGetUserPost,
  validateLikePost,
} from '@validations/postValidations';
import PaginationResult from '@app/utils/typings/paginate.interface';
import PostSchema from '@app/models/typings/postSchema.interface';

const createPost = catchAsync(async (req: Request, res: Response) => {
  // Our register logic starts here
  try {
    // Get user input
    const data = req.body ?? {};

    delete data.pictureCategory;

    const { error, value } = validateCreatePost(data);

    if (error) {
      return res.status(400).json(
        createResponse(false, null, {
          code: 400,
          message: error.details.map((err) => err.message),
        })
      );
    }

    if (req.user) {
      const filesUrl: Array<String> = [];

      Array.isArray(req.files) &&
        req.files?.forEach((file) => filesUrl.push(`posts/${file.filename}`));

      let featuredImage = filesUrl.length === 0 ? '' : data.featuredImage ?? '';

      // By default the first image is used as featured image to posting
      if (filesUrl.length > 0 && !filesUrl.includes(featuredImage)) {
        featuredImage = filesUrl[0];
      }

      const postData = {
        ...data,
        authorId: new Types.ObjectId(req.user._id),
        images: filesUrl,
        featuredImage,
      };

      const newPost = new PostModel(postData);

      const savedDoc = await newPost.save();

      const post = {
        ...postData,
        createdAt: savedDoc.createdAt,
        updatedAt: savedDoc.updatedAt,
      };

      res.status(201).json(createResponse<Models.Post>(true, post, null));
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

const getFeedPosts = catchAsync(async (req: Request, res: Response) => {
  try {
    const data = req.query ?? {};
    let { page, pageSize } = data;

    let pageNumber: number = !page ? 0 : typeof page === 'string' ? parseInt(page) : 0;
    let pageSizeNumber: number = !pageSize
      ? 10
      : typeof pageSize === 'string'
      ? parseInt(pageSize)
      : 10;

    let query = PostModel.find().sort({ createdAt: -1 });

    if (isNaN(pageNumber)) pageNumber = 0;
    if (isNaN(pageSizeNumber)) pageSizeNumber = 10;

    if (!query) {
      return res.status(402).send("User doesn't exist");
    }
    let result = await paginate(query, pageNumber, pageSizeNumber);

    let formattedResult: PaginationResult<Models.Post> = {
      ...result,
      results: result.results.map(
        (doc: PostSchema): Models.Post => ({
          title: doc.title,
          content: doc.title,
          authorId: doc.authorId.toString(),
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
          tags: doc.tags,
          images: doc.images,
          category: doc.category,
          featuredImage: doc.featuredImage,
        })
      ),
    };

    console.log(formattedResult);

    res
      .status(200)
      .json(createResponse<PaginationResult<Models.Post>>(true, formattedResult, null));
  } catch (err: any) {
    res.status(409).json(
      createResponse(false, null, {
        code: 409,
        message: err.message,
      })
    );
  }
});

const getUserPosts = catchAsync(async (req: Request, res: Response) => {
  try {
    const queryParams = req.query ?? {};
    let { page, pageSize } = queryParams;

    const routeParams = req.params ?? {};
    let { userId } = routeParams;

    const { error, value } = validateGetUserPost({ userId });

    if (error) {
      res.status(400).send(error.details);
    }

    let pageNumber: number = !page ? 0 : typeof page === 'string' ? parseInt(page) : 0;
    let pageSizeNumber: number = !pageSize
      ? 10
      : typeof pageSize === 'string'
      ? parseInt(pageSize)
      : 10;

    const query = PostModel.find({ userId }).sort({
      createdAt: -1,
    });

    if (isNaN(pageNumber)) pageNumber = 0;
    if (isNaN(pageSizeNumber)) pageSizeNumber = 10;

    let result = await paginate(query, pageNumber, pageSizeNumber);

    res.status(200).json(result);
  } catch (err: any) {
    res.status(409).json({ message: err.message });
  }
});

const likePost = catchAsync(async (req: Request, res: Response) => {
  try {
    const routeParams = req.params ?? {};

    let { id } = routeParams;

    const { error, value } = validateLikePost({ id });

    if (error) {
      return res.status(400).send(error.details);
    }

    const post = await PostModel.findById(id);

    if (post) {
      let userIdString = req.user?._id && req.user?._id.toString();

      if (!userIdString) {
        return res.status(402).send("User doesn't exist");
      }

      const isLiked = post.likes.get(userIdString);

      if (isLiked) {
        post.likes.delete(userIdString);
      } else {
        post.likes.set(userIdString, true);
      }

      const updatedPost = await PostModel.findByIdAndUpdate(
        id,
        {
          likes: post.likes,
        },
        { new: true }
      );

      res.status(200).json(updatedPost);
    }

    return res.status(404).json({ message: "Post doesn't exist" });
  } catch (err: any) {
    res.status(409).json({ message: err.message });
  }
});

export { createPost, getFeedPosts, getUserPosts, likePost };
