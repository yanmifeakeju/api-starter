import { prisma } from '../../shared/database/prisma.js';
import { AppError } from '../../shared/error/AppError.js';
import { hashPassword } from '../../utils/password.js';
import { CreateUserInput, CreateUserResponse } from './users.schema.js';

export const createUser = async (
  data: CreateUserInput
): Promise<CreateUserResponse> => {
  const existingUser = await prisma.user.findFirst({
    where: { email: data.email }
  });

  if (existingUser)
    throw new AppError('DUPLICATE_ENTRY', 'Email already taken.');

  const user = await prisma.user.create({
    data: {
      ...data,
      password: await hashPassword(data.password)
    }
  });

  return { email: user.email, username: user.username };
};
