import { prisma } from '../../utils/database/prisma.js';
import { hashPassword } from '../../utils/encryption/password.js';
import { CreateUserInput, CreateUserResponse } from './users.schema.js';

export const createUser = async (
  data: CreateUserInput
): Promise<CreateUserResponse> => {
  const existingUser = await prisma.user.findFirst({
    where: { email: data.email }
  });

  if (existingUser) throw new Error('Email already taken.');

  const user = await prisma.user.create({
    data: {
      ...data,
      password: await hashPassword(data.password)
    }
  });

  return { email: user.email, username: user.username };
};
