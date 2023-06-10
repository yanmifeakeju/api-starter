import { FastifyReply, FastifyRequest } from 'fastify';
import { createUser } from './users.service.js';
import { CreateUserInput } from './users.schema.js';

export const registerUserHandler = async (
  request: FastifyRequest<{
    Body: CreateUserInput;
  }>,
  reply: FastifyReply
) => {
  const { body } = request;

  const result = await createUser(body);

  return reply.code(201).send({ success: true, message: '', data: result });
};
