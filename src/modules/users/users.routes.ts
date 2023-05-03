import { FastifyInstance } from 'fastify';
import { registerUserHandler } from './users.controllers.js';
import { $ref } from './users.schema.js';

export const userRoutes = (server: FastifyInstance) => {
  server.post(
    '/',
    {
      schema: {
        body: $ref('createUserSchema'),
        response: {
          201: $ref('createUserResponseSchema'),
        },
      },
    },
    registerUserHandler
  );
  return server;
};
