import { faker } from '@faker-js/faker';
import { Types } from 'mongoose';

import Post from '@models/typings/post.interface';
import PostModel from '@models/post';

import User from '@models/typings/user.interface';
import UserModel from '@models/user';

const seedPosts = async function () {
  try {
    await PostModel.deleteMany({});
    console.log('dropped posts collection');

    const users: User[] = await UserModel.find().limit(10);

    if (users.length === 0) {
      throw new Error("There's no existing users, please create them first");
    }

    const posts: Post[] = [];
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * users.length);
      const user: User = users[randomIndex];

      if (user && user?._id) {
        const post: Post = {
          userId: user._id,
          picturePath: 'posts/1685735058624-239085575.jpg',
          description: faker.lorem.paragraph(),
          likes: new Types.Map<Boolean>(),
        };
        posts.push(post);
      }
    }
    const res = await PostModel.insertMany(posts);
    console.log('Seeded posts collection');
    return res;
  } catch (err) {
    throw err;
  }
};

export { seedPosts };
