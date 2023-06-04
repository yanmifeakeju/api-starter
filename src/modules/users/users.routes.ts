import { FastifyInstance } from 'fastify';
import { registerUserHandler } from './users.controllers.js';
import { register, buildJsonSchemas } from 'fastify-zod';
import {
  CreateUserResponseSchema,
  CreateUserInputSchema
} from './users.schema.js';

export const userRoutes = async (server: FastifyInstance) => {
  await register(server, {
    jsonSchemas: buildJsonSchemas(
      {
        CreateUserInputSchema,
        CreateUserResponseSchema
      },
      { errorMessages: true }
    )
  });
  server.zod.post(
    '/',
    {
      operationId: 'createUser',
      body: 'CreateUserInputSchema',
      reply: 'CreateUserResponseSchema'
    },
    registerUserHandler
  );

  return server;
};
