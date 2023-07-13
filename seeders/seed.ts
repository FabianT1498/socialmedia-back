import * as dotenv from 'dotenv';

import { seedUsers } from './userSeeder';
// import { seedPosts } from './postSeeder';

dotenv.config();

import connect from '../src/config/database';

const seed = async () => {
  try {
    await connect();
    await seedUsers();
    // await seedPosts();
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

seed();
