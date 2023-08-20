import { UserModule, type UserSchema } from '../../../core/index.js';

export const loginUser = async (data: Pick<UserSchema.User, 'email' | 'password'>) => {
  const user = await UserModule.findUserWithCredentials(data);
  const lastLogin = new Date();

  setImmediate(() => console.log('user logged in', lastLogin));
  return { ...user, lastLogin };
};

export const getAuthUser = async (_userId: string) => {
  // const user = await UserModule
  throw new Error('Unimplemented');
};

export const initiateForgotPasswordRequest = async (_email: string) => {
  throw new Error('Unimplemented');
};

export const completeForgotPasswordRequest = async (_token: string) => {
  throw new Error('Unimplemented');
};

export const changeUserPassword = async (_password: string) => {
  throw new Error('Unimplemented');
};
