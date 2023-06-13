import { describe, expect, vi, it, beforeEach, afterEach } from 'vitest';
import { createUser } from '../users.service.js';
import { CreateUserInput } from '../users.schema.js';
import { faker } from '@faker-js/faker';
import { hashPassword } from '../../../utils/password.js';
import { prisma } from '../../../libs/prisma/__mocks__/index.js';

vi.mock('../../../libs/prisma/index.js');

describe('createUser()', () => {
  it('should throw error when called with empty fields', async () => {
    const newUser: CreateUserInput = {
      email: '',
      password: '',
      username: ''
    };

    expect(() => createUser(newUser)).rejects.toThrow();
  });

  it('should should return the correct user output', async () => {
    const newUser: CreateUserInput = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      username: faker.internet.userName()
    };

    const createdUser = {
      created_at: new Date(),
      email: newUser.email,
      username: newUser.username,
      id: 1,
      password: await hashPassword(newUser.password),
      user_id: faker.string.uuid()
    };

    prisma.user.findFirst.mockResolvedValueOnce(null);
    prisma.user.create.mockResolvedValueOnce(createdUser);

    const user = await createUser(newUser);

    expect(user).toStrictEqual({
      userId: createdUser.user_id,
      email: createdUser.email,
      username: createdUser.username,
      createdAt: createdUser.created_at
    });

    expect(prisma.user.findFirst).toHaveBeenCalledOnce();
    expect(prisma.user.create).toHaveBeenCalledOnce();
  });
});
