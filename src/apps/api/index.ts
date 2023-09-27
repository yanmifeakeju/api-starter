import AutoLoad from '@fastify/autoload'
import { type TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import Fastify, { type FastifyInstance } from 'fastify'
import path from 'path'
import { fileURLToPath } from 'url'
import { env } from '../../config/env.js'
import { AppError } from '../../shared/error/AppError.js'
import { generateSchemaErrorMessage } from '../../utils/error-message.js'
import { mapAppErrorToApiError } from '../../utils/errors.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const logger = env.NODE_ENV !== 'production'
	? { level: 'debug', transport: { target: 'pino-pretty' } }
	: { level: 'info' }

export const app = async (): Promise<FastifyInstance> => {
	const fastify = Fastify({
		schemaErrorFormatter: function(errors, _httpPart) {
			const error = generateSchemaErrorMessage(errors)
			return new Error(error)
		},
		ignoreTrailingSlash: true,
		logger,
	}).withTypeProvider<TypeBoxTypeProvider>()

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

	// Autoload plugins from plugins folder
	fastify.register(AutoLoad, {
		dir: path.join(__dirname, 'plugins'),
		forceESM: true,
	})

	// Autoload routes from routes folder
	fastify.register(AutoLoad, {
		dir: path.join(__dirname, 'routes'),
		forceESM: true,
		indexPattern: /.*routes(\.js|\.cjs|\.ts)$/i, // matches .routes files only
		ignorePattern: /(.*\.js)|.*schema.*/,
		autoHooksPattern: /.*hooks(\.js|\.cjs)$/i,
		autoHooks: true,
		cascadeHooks: true,
	})

	fastify.get('/health-check', async () => ({ status: 'OK' }))

	await fastify.ready()
	console.log(fastify.printRoutes())
	return fastify
}
