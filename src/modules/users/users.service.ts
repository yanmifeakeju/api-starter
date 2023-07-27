import { prisma } from '../../libs/prisma/index.js';
import { AppError } from '../../shared/error/AppError.js';
import { OnlyOneProperty } from '../../types/util-types/index.js';
import { hashPassword, verifyPassword } from '../../utils/password.js';
import {
  CreateUserInput,
  CreateUserInputSchema,
  FindUserInputSchema,
  UserProfile
} from './users.schema.js';
import { schemaValidator } from '../../utils/validator.js';
import { serviceAsyncWrapper } from '../../utils/service-wrapper.js';
import { userRepository } from './repository/index.js';

const assertIsValidCreateUserInput = schemaValidator(CreateUserInputSchema);
const assertIsValidFindUserInput = schemaValidator(FindUserInputSchema);

export const createUser = serviceAsyncWrapper(
  async (data: CreateUserInput): Promise<UserProfile> => {
    assertIsValidCreateUserInput(data);

    const existingUser = await userRepository.findOne(data);
    if (existingUser)
      throw new AppError('DUPLICATE_ENTRY', 'Email or username already taken.');

    const user = await userRepository.create({
      ...data,
      password: await hashPassword(data.password)
    });

    return user;
  }
);

export const findUser = serviceAsyncWrapper(
  async (
    data: OnlyOneProperty<{ userId: string; email: string }>
  ): Promise<UserProfile> => {
    assertIsValidFindUserInput(data);

    const user = await userRepository.findUnique(data);

    if (!user) throw new AppError('NOT_FOUND', 'User not found.');

    return user;
  }
);

export const authenticateUser = serviceAsyncWrapper(
  async (data: { email: string; password: string }): Promise<string> => {
    const user = await userRepository.findUserWithCredentials(data.email);
    if (!user) throw new AppError('NOT_FOUND', 'Invalid credentials.');

    const isPassword = await verifyPassword(data.password, user.password);
    if (!isPassword) throw new AppError('NOT_FOUND', 'Invalid credentials.');

    await userRepository.update(user.userId, { lastLogin: new Date() });

    return user.userId;
  }
);
