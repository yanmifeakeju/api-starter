import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import {
  createUser,
  findUser,
  authenticateUser
} from '../../../modules/users/users.service.js';
import { CreateUserInput } from '../../../modules/users/users.schema.js';

export const registerUser = async function (
  this: FastifyInstance,
  request: FastifyRequest<{
    Body: CreateUserInput;
  }>,
  reply: FastifyReply
) {
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

export const fetchUserProfile = async function (
  this: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { user } = request as { user: { userId: string } };
  const response = await findUser(user);
  reply
    .code(200)
    .send({ success: true, message: 'Fetched user profile', data: response });
};

export const loginUser = async function (
  this: FastifyInstance,
  request: FastifyRequest<{
    Body: { email: string; password: string };
  }>,
  reply: FastifyReply
) {
  const { email, password } = request.body;

  const userId = await authenticateUser({ email, password });

  return reply.code(200).send({
    success: true,
    message: 'Successfully logged in.',
    data: {
      session: {
        authToken: await reply.jwtSign({ userId })
      }
    }
  });
};
