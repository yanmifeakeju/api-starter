import { Type, type TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { type FastifyInstance, type RouteHandlerMethod, type RouteOptions } from 'fastify';
import { UserSchema } from '../../../core/index.js';
import { BaseResponseSchema, ErrorResponseSchema } from '../../../shared/schema/index.js';
import { fetchUserProfile, loginUser, registerUser } from './users.controllers.js';

export const userRoutes = async (fastify: FastifyInstance) => {
  const server = fastify.withTypeProvider<TypeBoxTypeProvider>();

  server.register(
    async function(routePlugin) {
      const routes: RouteOptions[] = [
        {
          method: 'POST',
          url: '/',
          handler: registerUser as RouteHandlerMethod,
          schema: {
            body: UserSchema.createUserProfileSchema,
            response: {
              201: Type.Intersect([
                BaseResponseSchema,
                Type.Object({
                  data: Type.Object({
                    session: Type.Object({
                      authToken: Type.String(),
                    }),
                  }),
                }),
              ]),
              422: ErrorResponseSchema,
            },
          },
        },

        {
          method: 'GET',
          url: '/',
          handler: fetchUserProfile as RouteHandlerMethod,
          onRequest: [server.authenticate],
          schema: {
            response: {
              200: Type.Intersect([
                BaseResponseSchema,
                Type.Object({
                  data: UserSchema.userProfileSchema,
                }),
              ]),
            },
          },
        },

        {
          method: 'POST',
          url: '/sign_in',
          handler: loginUser as RouteHandlerMethod,
          schema: {
            body: UserSchema.userAuthSchema,
            response: {
              200: Type.Intersect([
                BaseResponseSchema,
                Type.Object({
                  data: Type.Object({
                    session: Type.Object({
                      authToken: Type.String(),
                    }),
                  }),
                }),
              ]),
            },
          },
        },
      ];

      routes.forEach((route) => routePlugin.route(route));
    },
    { prefix: '/users' },
  );

  return server;
};
