import { FastifyInstance } from 'fastify';
import {
  loginHandler,
  registerUserHandler,
  userProfileHandler
} from './users.controllers.js';
import {
  UserProfileSchema,
  CreateUserInputSchema,
  LoginUserInputSchema
} from './users.schema.js';
import {
  BaseResponseSchema,
  ErrorResponseSchema
} from '../../libs/schema/index.js';
import { Type, TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

export const userRoutes = async (fastify: FastifyInstance) => {
  const server = fastify.withTypeProvider<TypeBoxTypeProvider>();
  server.post(
    '/',

    {
      schema: {
        body: CreateUserInputSchema,
        response: {
          201: Type.Intersect([
            BaseResponseSchema,
            Type.Object({
              data: Type.Object({
                session: Type.Object({
                  authToken: Type.String()
                })
              })
            })
          ]),
          422: ErrorResponseSchema
        }
      }
    },

    registerUserHandler
  );

  server.get(
    '/',
    {
      onRequest: [server.authenticate],
      schema: {
        response: {
          200: Type.Intersect([
            BaseResponseSchema,
            Type.Object({
              data: UserProfileSchema
            })
          ])
        }
      }
    },

    userProfileHandler
  );

  server.post(
    '/sign_in',

    {
      schema: {
        body: LoginUserInputSchema,
        response: {
          200: Type.Intersect([
            BaseResponseSchema,
            Type.Object({
              data: Type.Object({
                session: Type.Object({
                  authToken: Type.String()
                })
              })
            })
          ]),
          422: ErrorResponseSchema
        }
      }
    },

    loginHandler
  );

  return server;
};
