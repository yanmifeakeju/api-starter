import Ajv, { type AnySchema, type DefinedError } from 'ajv'
import addFormats from 'ajv-formats'
import { AppError } from './error/AppError.js'
import { generateSchemaErrorMessage } from './error/error-message.js'

export const ajv = addFormats
	.default(new Ajv.default({}), [
		'date-time',
		'time',
		'date',
		'email',
		'hostname',
		'ipv4',
		'ipv6',
		'uri',
		'uri-reference',
		'uuid',
		'uri-template',
		'json-pointer',
		'relative-json-pointer',
		'regex',
		'password',
	])
	.addKeyword('kind')
	.addKeyword('modifier')

export function schemaValidator<T>(schema: AnySchema) {
	const validate = ajv.compile(schema)

	return (payload: T) => {
		const isValid = validate(payload)

		if (!isValid) {
			throw new AppError(
				'ILLEGAL_ARGUMENT',
				generateSchemaErrorMessage(validate.errors as DefinedError[]),
			)
		}

		return payload
	}
}
