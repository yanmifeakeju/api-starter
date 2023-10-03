import { type FastifyServerOptions } from 'fastify'
import { env } from '../../../config/env/env.js'
import { generateSchemaErrorMessage } from '../../../utils/error/error-message.js'

export default {
	schemaErrorFormatter: function(errors, _httpPart) {
		const error = generateSchemaErrorMessage(errors)
		return new Error(error)
	},
	ajv: {
		customOptions: {
			coerceTypes: 'array',
			removeAdditional: 'all',
		},
	},
	disableRequestLogging: true,
	requestIdLogLabel: 'request-id',
	requestIdHeader: 'x-request-id',
	logger: {
		level: env.SEVER_LOG_LEVEL || 'info',
		redact: {
			censor: '***',
			paths: [
				'req.headers.authorization',
				'req.body.password',
				'req.body.email',
				'req.body.phone',
			],
		},
		serializers: {
			req: function(request) {
				const shouldLogBody = request.routeOptions.config.logBody === true
				return {
					method: request.method,
					url: request.raw.url,
					routeUrl: request.routeOptions.url,
					version: request.headers?.['accept-version'],
					user: request.user && { userId: request.user.userId, lastLogin: request.user.lastLogin },
					headers: request.headers,
					body: shouldLogBody ? request.body : undefined,
					hostname: request.hostname,
					remoteAddress: request.ip,
					remotePort: request.socket?.remotePort,
				}
			},
			res: function(reply) {
				return {
					statusCode: reply.statusCode,
					responseTime: reply.getResponseTime && reply.getResponseTime(),
				}
			},
		},
	},
} as FastifyServerOptions
