import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcryptjs';

import User from '@models/typings/user.interface';
import UserModel from '@models/user';

const seedUsers = async function () {
  try {
    await UserModel.deleteMany({});
    console.log('dropped users collection');

    const password = 'test123';
    const encryptedPassword = await bcrypt.hash(password, 10);

    const users: User[] = [];
    for (let i = 0; i < 10; i++) {
      const user: User = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email().toLocaleLowerCase(),
        password: encryptedPassword,
        friends: [],
        location: faker.location.direction(),
        occupation: faker.person.jobTitle(),
      };
      users.push(user);
    }
    const res = await UserModel.insertMany(users);
    console.log('Seeded users collection');
    return res;
  } catch (err) {
    throw err;
  }
};

export { seedUsers };
