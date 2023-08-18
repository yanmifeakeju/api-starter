import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { CreateUserInput } from '../../../core/modules/users/users.schema.js';
import { UserModule } from '../../../core/index.js';

export const registerUser = async function (
  this: FastifyInstance,
  request: FastifyRequest<{
    Body: CreateUserInput;
  }>,
  reply: FastifyReply
) {
  const { body } = request;
  this.log.info('testing');
  const response = await UserModule.createUser(body);

  reply.status(201);

  return {
    success: true,
    message: 'User registered successfully.',
    data: {
      session: {
        authToken: await reply.jwtSign({
          userId: response.userId,
          lastLogin: response.lastLogin
        })
      }
    }
  };
};

export const fetchUserProfile = async function (
  this: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { user } = request as { user: { userId: string; lastLogin: Date } };
  const response = await UserModule.findUser({ userId: user.userId });

  if (user.lastLogin !== response.lastLogin)
    request.log.info('a new session somewhere');

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

  const user = await UserModule.authenticateUser({ email, password });

  reply.status(200);

  return {
    success: true,
    message: 'Successfully logged in.',
    data: {
      session: {
        authToken: await reply.jwtSign({
          userId: user.userId,
          lastLogin: user.lastLogin
        })
      }
    }
  };
};
