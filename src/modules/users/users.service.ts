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

const assertIsValidCreateUserInput = schemaValidator(CreateUserInputSchema);
const assertIsValidFindUserInput = schemaValidator(FindUserInputSchema);

export const createUser = serviceAsyncWrapper(
  async (data: CreateUserInput): Promise<UserProfile> => {
    assertIsValidCreateUserInput(data);

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email: data.email
          },
          {
            username: data.username
          }
        ]
      }
    });

    if (existingUser)
      throw new AppError('DUPLICATE_ENTRY', 'Email or username already taken.');

    const user = await prisma.user.create({
      data: {
        ...data,
        password: await hashPassword(data.password)
      }
    });

    return {
      email: user.email,
      username: user.username,
      userId: user.user_id,
      createdAt: user.created_at
    };
  }
);

export const findUser = serviceAsyncWrapper(
  async (
    data: OnlyOneProperty<{ userId: string; email: string }>
  ): Promise<UserProfile> => {
    assertIsValidFindUserInput(data);

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email: data.email
          },
          {
            user_id: data.userId
          }
        ]
      }
    });

    if (!user) throw new AppError('NOT_FOUND', 'User not found.');

    return {
      email: user.email,
      userId: user.user_id,
      username: user.username,
      createdAt: user.created_at
    };
  }
);

export const validateAuthCreds = serviceAsyncWrapper(
  async (data: { email: string; password: string }): Promise<UserProfile> => {
    const user = await prisma.user.findUnique({
      where: {
        email: data.email
      }
    });

    if (!user) throw new AppError('NOT_FOUND', 'Invalid credentials.');

    const isPassword = await verifyPassword(data.password, user.password);
    if (!isPassword) throw new AppError('NOT_FOUND', 'Invalid credentials.');

    return {
      email: user.email,
      userId: user.user_id,
      username: user.username,
      createdAt: user.created_at
    };
  }
);
