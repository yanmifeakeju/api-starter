import { Type, Static } from '@sinclair/typebox';

export const CreateUserInputSchema = Type.Object(
  {
    email: Type.String({ format: 'email' }),
    username: Type.String(),
    password: Type.String({ minLength: 8 })
  },
  { additionalProperties: false }
);

export const CreateUserResponseSchema = Type.Omit(CreateUserInputSchema, [
  'password'
]);

export type CreateUserInput = Static<typeof CreateUserInputSchema>;
export type CreateUserResponse = Static<typeof CreateUserResponseSchema>;
