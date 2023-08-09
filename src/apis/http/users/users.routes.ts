import { FastifyInstance } from 'fastify';
import {
  loginUser,
  registerUser,
  fetchUserProfile
} from './users.controllers.js';
import {
  UserProfileSchema,
  CreateUserInputSchema,
  UserAuthSchema
} from '../../../modules/users/users.schema.js';
import {
  BaseResponseSchema,
  ErrorResponseSchema
} from '../../../shared/schema/index.js';
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

    registerUser.bind(fastify)
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

    fetchUserProfile.bind(fastify)
  );

  server.post(
    '/sign_in',

    {
      schema: {
        body: UserAuthSchema,
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

    loginUser.bind(fastify)
  );

  return server;
};
