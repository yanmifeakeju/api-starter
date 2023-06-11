import fp from 'fastify-plugin';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import { env } from '../config/env.js';
import {
  FastifyPluginAsyncTypebox,
  Type
} from '@fastify/type-provider-typebox';
import { UserSchema } from '../modules/users/users.schema.js';
import { ajv } from '../utils/ajv.js';

export default fp<FastifyPluginAsyncTypebox>(async function (fastify, opts) {
  await fastify.register(swagger, {});

  await fastify.register(swaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        next();
      },
      preHandler: function (request, reply, next) {
        next();
      }
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => {
      return swaggerObject;
    },
    transformSpecificationClone: true
  });
});
