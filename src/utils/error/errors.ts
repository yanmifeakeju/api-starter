import { env } from '../../config/env/env.js'
import { logger } from '../../shared/logger/pino.js'
import { type AppError } from './AppError.js'

const convertAppErrorTypeToApiStatusCode = (value: AppError['errorType']) => {
	switch (value) {
		case 'DUPLICATE_ENTRY':
			return 409
		case 'ILLEGAL_ARGUMENT':
			return 422
		case 'INVALID_ARGUMENT':
			return 400
		case 'FORBIDDEN':
			return 403
		case 'NOT_FOUND':
			return 404
		case 'TOO_MANY_REQUESTS':
			return 429
		case 'FATAL':
		case 'DATABASE_ERROR':
			return 500
		default:
			500
	}

	return 500
}

export const mapAppErrorToApiError = (error: AppError) => {
	return {
		statusCode: convertAppErrorTypeToApiStatusCode(error.errorType),
		message: error.message,
	}
}

export const handleAppError = (label: string, error: Error) => {
	if (env.NODE_ENV !== 'production')
		logger.error({ label: label.toUpperCase(), error: error?.message || JSON.stringify(error), stack: error.stack })

	throw error
}
