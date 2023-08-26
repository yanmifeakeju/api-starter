import { UserModule, type UserTypes, UserValidator } from '../../../core/index.js';
import { AppError } from '../../../shared/error/AppError.js';

export const registerUser = async (
  data: Omit<UserTypes.UserProfile & { password: string }, 'lastLogin' | 'userId'>,
) => {
  const { email, password, username } = UserValidator.validateCreateUserData(data);

  const existingUser = await UserModule.find({ email, username });
  if (existingUser) throw new AppError('DUPLICATE_ENTRY', 'Email or username already taken.');

  return UserModule.create({ email, password, username });
};

export const completeUserVerification = async () => {};
