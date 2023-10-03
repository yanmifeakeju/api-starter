import { type FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import fp from 'fastify-plugin'
import { AppError } from '../../../utils/error/AppError.js'
import { mapAppErrorToApiError } from '../../../utils/error/errors.js'

export default fp<FastifyPluginAsyncTypebox>(async function(fastify) {
	fastify.setErrorHandler((error, request, reply) => {
		request.log.error(error)

		const err = {
			statusCode: error.statusCode,
			error: error.message,
		}

		if (error instanceof AppError) {
			const appErrorToApiError = mapAppErrorToApiError(error)
			err.statusCode = appErrorToApiError.statusCode
			err.error = appErrorToApiError.message
		}

		return reply
			.status(err.statusCode || 500)
			.send({ success: false, error: err.statusCode ? err.error : 'Oops. Something went wrong.' })
	})

	fastify.addHook('onRequest', async (req) => {
		req.log.info({ req }, 'incoming request')
	})

	fastify.addHook('onResponse', async (req, res) => {
		req.log.info({ req, res }, 'request completed')
	})
})
