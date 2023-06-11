import { Type, Static } from '@sinclair/typebox';
import { DateSchema } from '../../shared/schema/index.js';



export const UserSchema = Type.Object(
  {
    id: Type.Number(),
    userId: Type.String({ format: 'uuid' }),
    email: Type.String({ format: 'email' }),
    username: Type.String(),
    password: Type.String({ minLength: 8 }),
    createdAt: DateSchema
  },
  { additionalProperties: false }
);

export const CreateUserInputSchema = Type.Pick(UserSchema, [
  'email',
  'password',
  'username'
]);

export const UserProfileSchema = Type.Omit(UserSchema, ['id', 'password']);

export const LoginUserInputSchema = Type.Pick(UserSchema, [
  'email',
  'password'
]);

export type User = Static<typeof UserSchema>;
export type CreateUserInput = Static<typeof CreateUserInputSchema>;
export type UserProfile = Static<typeof UserProfileSchema>;
export type LoginUserInput = Static<typeof LoginUserInputSchema>;
