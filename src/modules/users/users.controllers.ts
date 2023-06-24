import { FastifyReply, FastifyRequest } from 'fastify';
import { createUser, findUser, validateAuthCreds } from './users.service.js';
import { CreateUserInput } from './users.schema.js';

export const registerUserHandler = async (
  request: FastifyRequest<{
    Body: CreateUserInput;
  }>,
  reply: FastifyReply
) => {
  const { body } = request;

  const response = await createUser(body);

  return reply.code(201).send({
    success: true,
    message: 'User registered successfully.',
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
  const response = await findUser(user);
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

  const user = await validateAuthCreds({ email, password });

  return reply.code(200).send({
    success: true,
    message: 'Successfully logged in.',
    data: {
      session: {
        authToken: await reply.jwtSign({ userId: user.userId })
      }
    }
  });
};
