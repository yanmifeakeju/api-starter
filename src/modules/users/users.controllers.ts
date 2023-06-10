import { FastifyReply, FastifyRequest } from 'fastify';
import { createUser } from './users.service.js';
import { CreateUserInput } from './users.schema.js';
import { wrapService } from '../../utils/service-wrapper.js';

export const registerUserHandler = async (
  request: FastifyRequest<{
    Body: CreateUserInput;
  }>,
  reply: FastifyReply
) => {
  const { body } = request;

  const wrappedResponse = wrapService(createUser, body);
  const response = await wrappedResponse;

  return reply.code(201).send({ success: true, message: '', data: response });
};
