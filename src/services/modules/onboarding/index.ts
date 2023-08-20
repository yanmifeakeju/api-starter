import { UserModule, type UserSchema, UserValidator } from '../../../core/index.js';
import { AppError } from '../../../shared/error/AppError.js';

export const registerUser = async (
  data: Omit<UserSchema.UserProfile & { password: string }, 'lastLogin' | 'userId'>,
) => {
  const { email, password, username } = UserValidator.validateCreateUserData(data);

  const existingUser = await UserModule.findUser({ email, username });
  if (existingUser) throw new AppError('DUPLICATE_ENTRY', 'Email or username already taken.');

  return UserModule.createUser({ email, password, username });
};

export const initiateUserVerification = async () => {};

export const completeUserVerification = async () => {};
