import { type FastifyInstance, type FastifyReply, type FastifyRequest } from 'fastify'
import { type UserTypes } from '../../../../../core/index.js'

export const registerUser = async function(
  this: FastifyInstance,
  request: FastifyRequest<{
    Body: Omit<UserTypes.UserProfile & { password: string }, 'lastLogin'>
  }>,
  reply: FastifyReply,
) {
  const { body } = request

  const response = await this.services.onboarding.registerUser(body)

  reply.status(201)

  return {
    success: true,
    message: 'User registered successfully.',
    data: {
      session: {
        authToken: await reply.jwtSign({
          userId: response.userId,
        }),
      },
    },
  }
}

export const fetchUserProfile = async function(
  this: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { user } = request as { user: { userId: string } }
  const response = await this.services.auth.getAuthUser(user.userId)

  reply.status(200)
  return { success: true, message: 'Fetched user profile', data: response }
}

export const loginUser = async function(
  this: FastifyInstance,
  request: FastifyRequest<{
    Body: { email: string; password: string }
  }>,
  reply: FastifyReply,
) {
  const { email, password } = request.body

  const user = await this.services.auth.loginUser({ email, password })

  reply.status(200)
  return {
    success: true,
    message: 'Successfully logged in.',
    data: {
      session: {
        authToken: await reply.jwtSign({
          userId: user.userId,
        }),
      },
    },
  }
}
