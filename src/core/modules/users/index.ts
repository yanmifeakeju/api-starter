import { AppError } from '../../../shared/error/AppError.js';
import { moduleAsyncWrapper } from '../../../utils/module-wrapper.js';
import { verifyPassword } from '../../../utils/password.js';
import { fetchUser, fetchUserAuthCredentials, saveUser } from './repository/index.js';
import { type User, type UserProfile } from './schema.js';
import {
  validateCheckUserCredentialsSchema,
  validateCreateUserData,
  validateFindUserProfileData,
} from './validators.js';

const wrapper = moduleAsyncWrapper('users');

export const createUser = wrapper(
  async (input: Omit<User, 'userId' | 'lastLogin' | 'id'>): Promise<UserProfile> => {
    const { email, password, username } = validateCreateUserData(input);
    return saveUser({ email, password, username });
  },
);

export const findUser = wrapper(
  async (input: Partial<Pick<User, 'email' | 'username'>>): Promise<UserProfile | null> => {
    const data = validateFindUserProfileData(input);
    return fetchUser(data);
  },
);

export const findUserWithCredentials = wrapper(
  async (input: Pick<User, 'email' | 'password'>): Promise<UserProfile> => {
    const data = validateCheckUserCredentialsSchema(input);
    const result = await fetchUserAuthCredentials(data.email);

    if (!result) throw new AppError('NOT_FOUND', 'Invalid credentials.');

    const isUserCreds = await verifyPassword(data.password, result.cred.password);
    if (!isUserCreds) throw new AppError('NOT_FOUND', 'Invalid credentials.');

    return result.user;
  },
);
