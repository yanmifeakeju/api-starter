import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import { env } from '../../../config/env.js';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

const C = Type.Object({
  userId: Type.String(),
  iat3: Type.Number()
});

export default fp(async function (fastify, opts) {
  const myCustomMessages = {
    badRequestErrorMessage: 'Format is Authorization: Bearer [token]',
    noAuthorizationInHeaderMessage: 'Authorization header is missing!',
    authorizationTokenExpiredMessage: 'Authorization token expired',
    authorizationTokenInvalid: (err: Error) => {
      return `Authorization token is invalid: ${err.message}`;
    }
  };

  fastify.register(fastifyJwt, {
    secret: env.AUTH_JWT_SECRET,
    messages: myCustomMessages,
    trusted: async function validateToken(request, data) {
      request.log.info('validate');
      request.log.info(data);
      return true;
    },

    // formatUser(payload) {
    //   fastify.log.info(payload);
    //   if (Value.Check(C, payload)) {
    //     return { userId: payload.userId, issuedAt: payload.iat3 };
    //   }

    //   return new Error('Hello');
    // },

    sign: {
      expiresIn: env.JWT_EXPIRES_IN
    }
  });

  fastify.decorate(
    'authenticate',
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        const decoded = await request.jwtVerify({
          complete: false
        });
        fastify.log.info(decoded);
      } catch (err) {
        return reply.send(err);
      }
    }
  );
});
