import { Prisma, User as UserEntity } from '@prisma/client';
import { prisma } from '../../../libs/prisma/index.js';
import { CreateUserInput, User, UserProfile } from '../users.schema.js';
import { IRepository } from '../../../shared/types/repository.js';
import { OnlyOneProperty } from '../../../types/util-types/index.js';
import { reportPrismaError } from '../../../utils/prismaError.js';
import { AppError } from '../../../shared/error/AppError.js';

interface IUserRepository extends IRepository<Partial<User>> {}

class UserRepository implements IUserRepository {
  private name = 'users';
  private userDTO(entity: UserEntity | null): UserProfile | null {
    if (!entity || entity.deleted_at) return null;

    return {
      userId: entity.user_id,
      email: entity.email,
      username: entity.username,
      lastLogin: entity.last_login
    };
  }

  async create(data: CreateUserInput) {
    try {
      const user = await prisma.user.create({
        data: {
          email: data.email,
          username: data.username,
          credentials: {
            create: {
              password: data.password
            }
          }
        }
      });

      return this.userDTO(user)!;
    } catch (error) {
      reportPrismaError(
        error as Error,
        `"${this.create.name}" operation failed on ${this.name}`
      );
    }
  }

  async findOne({
    email,
    username
  }: CreateUserInput): Promise<UserProfile | null> {
    try {
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            {
              email
            },
            {
              username
            }
          ]
        }
      });

      return this.userDTO(user);
    } catch (error) {
      reportPrismaError(
        error as Error,
        `"${this.findOne.name}" operation failed on ${this.name}`
      );
    }
  }

  async findUnique({
    email,
    userId,
    username
  }: OnlyOneProperty<
    Omit<UserProfile, 'lastLogin'>
  >): Promise<UserProfile | null> {
    try {
      const user = await prisma.user.findUnique({
        where: {
          ...(email && { email }),
          ...(username && { username }),
          ...(userId && { user_id: userId })
        }
      });

      return this.userDTO(user);
    } catch (error) {
      reportPrismaError(
        error as Error,
        `"${this.findUnique.name}" operation failed on ${this.name}`
      );
    }
  }

  async findUserWithCredentials(
    email: string
  ): Promise<(UserProfile & { password: string }) | null> {
    try {
      const userData = await prisma.user.findUnique({
        where: { email },
        include: {
          credentials: {
            select: { password: true }
          }
        }
      });

      if (!userData || userData.deleted_at || !userData.credentials)
        return null;

      const { credentials, ...user } = userData;
      const { password } = credentials;

      return { ...this.userDTO(user)!, password };
    } catch (error) {
      reportPrismaError(
        error as Error,
        `"${this.findUserWithCredentials.name}" operation failed on ${this.name}`
      );
    }
  }

  async findById(id: string): Promise<UserProfile | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { user_id: id }
      });

      return this.userDTO(user);
    } catch (error) {
      reportPrismaError(
        error as Error,
        `"${this.findById.name}" operation failed on ${this.name}`
      );
    }
  }

  findAll(): Promise<UserProfile[]> {
    throw new Error('Method not implemented.');
  }

  async update(
    id: string,
    data: Partial<Omit<UserProfile, 'userId'>>
  ): Promise<UserProfile> {
    try {
      const user = await prisma.user.update({
        where: { user_id: id },
        data: {
          ...(data.email && { email: data.email }),
          ...(data.lastLogin && { last_login: data.lastLogin }),
          ...(data.username && { username: data.username })
        }
      });

      return this.userDTO(user)!;
    } catch (error) {
      reportPrismaError(
        error as Error,
        `"${this.update.name}" operation failed on ${this.name}`
      );
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await prisma.user.update({
        where: { user_id: id },
        data: {
          deleted_at: new Date()
        }
      });
    } catch (error) {
      reportPrismaError(
        error as Error,
        `"${this.delete.name}" operation failed on ${this.name}`
      );
    }
  }
}

export const userRepository = new UserRepository();
