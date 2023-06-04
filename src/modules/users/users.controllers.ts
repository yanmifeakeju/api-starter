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
  try {
    const user = await createUser(body);
    return reply.code(201).send(user);
  } catch (error) {
    return reply
      .code(500)
      .send({ success: false, message: 'Internal Server Error' });
  }
};
