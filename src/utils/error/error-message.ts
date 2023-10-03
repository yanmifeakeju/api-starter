import { type DefinedError } from 'ajv'
import { type FastifySchemaValidationError } from 'fastify/types/schema.js'
export function generateSchemaErrorMessage(
	err: FastifySchemaValidationError[] | DefinedError[],
) {
	for (const error of err) {
		switch (error.keyword) {
			case 'required':
				return `Payload missing required property "${error.params.missingProperty}".`
			case 'format':
				return `"${error.instancePath.replace('/', '.')}" is not a valid ${error.params.format}`
			case 'minLength':
			case 'maxLength':
			case 'type':
				return `"${error.instancePath.replace('/', '.')}" ${error.message}`
			case 'enum':
				return `"${error.instancePath.replace('/', '.')}" ${error.message}: [${
					Array.isArray(error.params.allowedValues)
						? error.params.allowedValues.join(', ')
						: error.params.allowedValues
				}]`
			case 'additionalProperties':
				return `"${error.params.additionalProperty}" is not allowed.`
			default:
				break
		}
	}

	return 'Invalid payload.'
}
