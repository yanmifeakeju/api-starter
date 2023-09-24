import fastifyJwt from '@fastify/jwt'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'
import { env } from '../../../config/env.js'

declare module 'fastify' {
	export interface FastifyInstance {
		authenticate(): Promise<void>
	}
}

const myCustomMessages = {
	badRequestErrorMessage: 'Format is Authorization: Bearer [token]',
	noAuthorizationInHeaderMessage: 'Authorization header is missing!',
	authorizationTokenExpiredMessage: 'Authorization token expired',
	authorizationTokenInvalid: (err: Error) => {
		return `Authorization token is invalid: ${err.message}`
	},
}

export default fp(async function(fastify) {
	fastify.register(fastifyJwt, {
		secret: env.AUTH_JWT_SECRET,
		messages: myCustomMessages,
		trusted: async function validateToken(request, data) {
			request.log.info('validated')
			request.log.info(data)
			return true
		},

		// formatUser(payload) {
		//   fastify.log.info(payload);
		//   if (Value.Check(C, payload)) {
		//     return { userId: payload.userId, issuedAt: payload.iat3 };
		//   }

		//   return new Error('Hello');
		// },

		sign: {
			expiresIn: env.JWT_EXPIRES_IN,
		},
	})

	fastify.decorate(
		'authenticate',
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		async function(request: FastifyRequest, _reply: FastifyReply) {
			await request.jwtVerify({
				complete: false,
			})
		},
	)
})
