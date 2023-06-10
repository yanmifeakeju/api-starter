import { FastifyReply, FastifyRequest } from 'fastify';
import { createUser, findUser, validateAuthCreds } from './users.service.js';
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

  return reply.code(201).send({
    success: true,
    message: '',
    data: {
      session: {
        authToken: await reply.jwtSign({ userId: response.userId })
      }
    }
  });
};

export const userProfileHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { user } = request as { user: { userId: string } };
  const wrappedResponse = wrapService(findUser, user);
  const response = await wrappedResponse;
  reply
    .code(200)
    .send({ success: true, message: 'Fetched user profile', data: response });
};

export const loginHandler = async (
  request: FastifyRequest<{
    Body: { email: string; password: string };
  }>,
  reply: FastifyReply
) => {
  const { email, password } = request.body;
  const wrappedValidateAuthCreds = wrapService(validateAuthCreds, {
    email,
    password
  });

  const user = await wrappedValidateAuthCreds;

  return reply.code(200).send({
    success: true,
    message: '',
    data: {
      session: {
        authToken: await reply.jwtSign({ userId: user.userId })
      }
    }
  });
};
