import { Type, Static } from '@sinclair/typebox';
import { DateSchema } from '../../shared/schema/index.js';

export const UserSchema = Type.Object(
  {
    id: Type.Number(),
    userId: Type.String({ format: 'uuid' }),
    email: Type.String({ format: 'email' }),
    username: Type.String(),
    password: Type.String({ minLength: 8 }),
    lastLogin: DateSchema
  },
  { additionalProperties: false }
);

export const CreateUserInputSchema = Type.Pick(UserSchema, [
  'email',
  'password',
  'username'
]);

export const FindUserInputSchema = Type.Union([
  Type.Pick(UserSchema, ['email']),
  Type.Pick(UserSchema, ['userId'])
]);

export const UserProfileSchema = Type.Omit(UserSchema, ['id', 'password']);
export const UserAuthSchema = Type.Pick(UserSchema, ['email', 'password']);

export type User = Static<typeof UserSchema>;
export type UserProfile = Static<typeof UserProfileSchema>;
export type CreateUserInput = Static<typeof CreateUserInputSchema>;
export type LoginUserInput = Static<typeof UserAuthSchema>;
export type UserAuth = Static<typeof UserAuthSchema>;
