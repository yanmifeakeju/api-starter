import { type TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { type FastifyInstance } from 'fastify'
import { type FastifyReplyInferred, type FastifyRequestInferred } from '../../../../../@types/fastify/index.js'
import { type CreateUserSchema, type GetUserSchema, type SignInUserSchema } from './schemas/index.js'

export const registerUser = async function(
	this: FastifyInstance,
	request: FastifyRequestInferred<TypeBoxTypeProvider, typeof CreateUserSchema>,
	reply: FastifyReplyInferred<TypeBoxTypeProvider, typeof CreateUserSchema>,
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
	request: FastifyRequestInferred<TypeBoxTypeProvider, typeof GetUserSchema>,
	reply: FastifyReplyInferred<TypeBoxTypeProvider, typeof GetUserSchema>,
) {
	const { user } = request as { user: { userId: string } }
	const response = await this.services.auth.getAuthUser(user.userId)

	reply.status(200)
	return { success: true, message: 'Fetched user profile', data: response }
}

export const loginUser = async function(
	this: FastifyInstance,
	request: FastifyRequestInferred<TypeBoxTypeProvider, typeof SignInUserSchema>,
	reply: FastifyReplyInferred<TypeBoxTypeProvider, typeof SignInUserSchema>,
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
