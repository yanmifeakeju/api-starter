import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import { type FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import fp from 'fastify-plugin';

export default fp<FastifyPluginAsyncTypebox>(async function(fastify) {
  await fastify.register(swagger, {});

  await fastify.register(swaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
    uiHooks: {
      onRequest: function(_request, _reply, next) {
        next();
      },
      preHandler: function(_request, _reply, next) {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, _request, _reply) => {
      return swaggerObject;
    },
    transformSpecificationClone: true,
  });
});
