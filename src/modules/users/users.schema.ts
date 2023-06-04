import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';
import { baseResponseSchema } from '../../utils/schema/response.schema.js';

export const CreateUserInputSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string'
    })
    .email({ message: 'Please provide a valid email' }),
  username: z.string(),
  password: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string'
    })
    .min(8)
});

export const CreateUserResponseSchema = baseResponseSchema.merge(
  z.object({
    data: CreateUserInputSchema.omit({
      password: true
    })
  })
);

export type CreateUserInput = z.infer<typeof CreateUserInputSchema>;
export type CreateUserResponse = z.infer<typeof CreateUserResponseSchema>;
