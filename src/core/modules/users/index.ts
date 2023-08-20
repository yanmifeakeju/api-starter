import { AppError } from '../../../shared/error/AppError.js';
import { type OnlyOneProperty } from '../../../types/util-types/index.js';
import { moduleAsyncWrapper } from '../../../utils/module-wrapper.js';
import { hashPassword, verifyPassword } from '../../../utils/password.js';
import { fetchUniqueUser, fetchUser, fetchUserAuthCredentials, saveUser } from './repository.js';
import { type User, type UserProfile } from './schema.js';
import {
  validateCreateUserData,
  validateFindUniqueUserSchema,
  validateFindUserCredentialsData,
  validateFindUserProfileData,
} from './validators.js';

const wrapper = moduleAsyncWrapper('users');

export const createUser = wrapper(
  async (input: Omit<User, 'userId' | 'lastLogin' | 'id'>): Promise<UserProfile> => {
    const { email, password, username } = validateCreateUserData(input);
    return saveUser({ email, password: await hashPassword(password), username });
  },
);

export const findUser = wrapper(
  async (input: Partial<Pick<User, 'email' | 'username'>>): Promise<UserProfile | null> => {
    const data = validateFindUserProfileData(input);
    return fetchUser(data);
  },
);

export const findUniqueUser = wrapper(
  async (input: OnlyOneProperty<Pick<User, 'email' | 'username' | 'userId'>>): Promise<UserProfile> => {
    validateFindUniqueUserSchema(input);
    const user = await fetchUniqueUser(input);

    if (!user) throw new AppError('NOT_FOUND', 'Invalid credentials.');

    return user;
  },
);

export const findUserWithCredentials = wrapper(
  async (input: Pick<User, 'email' | 'password'>): Promise<UserProfile> => {
    const data = validateFindUserCredentialsData(input);
    const result = await fetchUserAuthCredentials(data.email);

    if (!result) throw new AppError('NOT_FOUND', 'Invalid credentials.');

    const isUserCreds = await verifyPassword(data.password, result.cred.password);
    if (!isUserCreds) throw new AppError('NOT_FOUND', 'Invalid credentials.');

    return result.user;
  },
);
