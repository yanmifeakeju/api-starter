import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { CreateUserInput } from '../../../modules/users/users.schema.js';
import { UserModule } from '../../../modules/users/index.js';

export const registerUser = async function (
  this: FastifyInstance,
  request: FastifyRequest<{
    Body: CreateUserInput;
  }>,
  reply: FastifyReply
) {
  const { body } = request;

  const response = await UserModule.createUser(body);

  reply.status(201);

  return {
    success: true,
    message: 'User registered successfully.',
    data: {
      session: {
        authToken: await reply.jwtSign({ userId: response.userId })
      }
    }
  };
};

export const fetchUserProfile = async function (
  this: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { user } = request as { user: { userId: string } };
  const response = await UserModule.findUser(user);

  reply.status(200);

  return { success: true, message: 'Fetched user profile', data: response };
};

export const loginUser = async function (
  this: FastifyInstance,
  request: FastifyRequest<{
    Body: { email: string; password: string };
  }>,
  reply: FastifyReply
) {
  const { email, password } = request.body;

  const userId = await UserModule.authenticateUser({ email, password });

  reply.status(200);

  return {
    success: true,
    message: 'Successfully logged in.',
    data: {
      session: {
        authToken: await reply.jwtSign({ userId })
      }
    }
  };
};
