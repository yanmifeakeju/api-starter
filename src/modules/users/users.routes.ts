import { FastifyInstance } from 'fastify';
import { registerUserHandler } from './users.controllers.js';
import {
  CreateUserResponseSchema,
  CreateUserInputSchema
} from './users.schema.js';
import { BaseResponseSchema } from '../../utils/schema/index.js';
import { Type, TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

export const userRoutes = async (fastify: FastifyInstance) => {
  const server = fastify.withTypeProvider<TypeBoxTypeProvider>();
  server.post(
    '/',

    {
      schema: {
        body: CreateUserInputSchema,
        response: {
          201: Type.Union([
            BaseResponseSchema,
            Type.Object({ data: CreateUserResponseSchema })
          ]),
          422: BaseResponseSchema
        }
      }
    },

    registerUserHandler
  );

  return server;
};
