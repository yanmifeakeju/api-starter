import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import { env } from '../../../config/env.js';
import { FastifyReply, FastifyRequest } from 'fastify';

export default fp(async function (fastify, opts) {
  fastify.register(fastifyJwt, {
    secret: env.AUTH_JWT_SECRET,
    sign: {
      expiresIn: env.JWT_EXPIRES_IN
    }
  });

  fastify.decorate(
    'authenticate',
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        return await request.jwtVerify();
      } catch (err) {
        return reply.send(err);
      }
    }
  );
});
