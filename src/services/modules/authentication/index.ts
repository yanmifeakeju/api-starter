import { UserSchema } from '../../../core/index.js';

export const loginUser = async (data: UserSchema.LoginUserInput) => {};

export const initiateUserVerification = async (
  user: UserSchema.UserProfile
) => {};

export const completeUserVerification = async () => {};

export const initiateForgotPasswordRequest = async (email: string) => {};

export const completeForgotPasswordRequest = async (token: string) => {};

export const changeUserPassword = async (password: string) => {};
