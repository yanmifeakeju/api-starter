import {
  FastifyInstance,
  RouteGenericInterface,
  RouteHandlerMethod,
  RouteOptions
} from 'fastify';
import {
  loginUser,
  registerUser,
  fetchUserProfile
} from './users.controllers.js';
import {
  UserProfileSchema,
  CreateUserInputSchema,
  UserAuthSchema
} from '../../../core/modules/users/users.schema.js';
import {
  BaseResponseSchema,
  ErrorResponseSchema
} from '../../../shared/schema/index.js';
import { Type, TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

export const userRoutes = async (fastify: FastifyInstance) => {
  const server = fastify.withTypeProvider<TypeBoxTypeProvider>();

  // let r: RouteShorthandOptions<>;
  let p: RouteGenericInterface = {};

  server.register(
    async function (routePlugin) {
      const routes: RouteOptions[] = [
        {
          method: 'POST',
          url: '/',
          handler: registerUser as RouteHandlerMethod,
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
                  data: UserProfileSchema
                })
              ])
            }
          }
        },

        {
          method: 'POST',
          url: '/sign_in',
          handler: loginUser as RouteHandlerMethod,
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
              ])
            }
          }
        }
      ];

      routes.forEach((route) => routePlugin.route(route));
    },
    { prefix: '/users' }
  );

  return server;
};
