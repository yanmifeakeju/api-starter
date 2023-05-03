import { prisma } from '../../utils/database/prisma.js';
import { hashPassword } from '../../utils/encryption/password.js';
import { CreateUserInput, CreateUserResponse } from './users.schema.js';

export const createUser = async (
  input: CreateUserInput
): Promise<CreateUserResponse> => {
  const user = await prisma.user.create({
    data: {
      ...input,
      password: await hashPassword(input.password),
    },
  });

  return { email: user.email, username: user.username };
};
