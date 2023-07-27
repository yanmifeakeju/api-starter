import { describe, expect, vi, it, afterAll } from 'vitest';
import { createUser } from '../users.service.js';
import { CreateUserInput } from '../users.schema.js';
import { faker } from '@faker-js/faker';
import { hashPassword } from '../../../utils/password.js';
import { prisma } from '../../../libs/prisma/__mocks__/index.js';
import { AppError } from '../../../shared/error/AppError.js';
import { randomInt } from 'crypto';

vi.mock('../../../libs/prisma/index.js');
vi.mock('../../../utils/password.js', () => ({
  hashPassword: vi.fn()
}));

afterAll(() => {
  vi.resetAllMocks();
});

describe('User Service', () => {
  describe('createUser()', () => {
    describe('Data Validation', () => {
      it('should throw error when called with empty fields', async () => {
        const newUser: CreateUserInput = {
          email: '',
          password: '',
          username: ''
        };

        expect(() => createUser(newUser)).rejects.toThrow(AppError);
      });

      it('should throw duplicate error when user already exists', async () => {
        const newUser: CreateUserInput = {
          email: faker.internet.email(),
          password: faker.internet.password(),
          username: faker.internet.userName()
        };

        const createdUser = {
          created_at: new Date(),
          last_login: new Date(),
          deleted_at: null,
          email: newUser.email,
          username: newUser.username,
          id: 1,
          user_id: faker.string.uuid()
        };

        prisma.user.findFirst.mockResolvedValueOnce(createdUser);

        expect(() => createUser(newUser)).rejects.toThrow(AppError);
        expect(prisma.user.findFirst).toHaveBeenCalledOnce();
        expect(prisma.user.create).not.toHaveBeenCalledOnce();
        expect(prisma.user.findFirst).toHaveBeenNthCalledWith(1, {
          where: {
            OR: [
              {
                email: newUser.email
              },
              {
                username: newUser.username
              }
            ]
          }
        });
      });
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
        last_login: new Date(),
        deleted_at: null,
        username: newUser.username,
        id: randomInt(1000),
        password: newUser.password,
        user_id: faker.string.uuid()
      };

      prisma.user.findFirst.mockResolvedValueOnce(null);
      prisma.user.create.mockResolvedValueOnce(createdUser);

      const user = await createUser(newUser);

      expect(user).toStrictEqual({
        userId: createdUser.user_id,
        email: createdUser.email,
        username: createdUser.username,
        lastLogin: createdUser.last_login
      });

      expect(prisma.user.findFirst).toHaveBeenCalledOnce();
      expect(prisma.user.create).toHaveBeenCalledOnce();
      expect(hashPassword).toHaveBeenNthCalledWith(1, newUser.password);
    });
  });

  describe.todo('findUser()', () => {});
  describe.todo('validateAuthCreds()', () => {});
});
