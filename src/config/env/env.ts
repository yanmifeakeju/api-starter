import { type Static, Type } from '@sinclair/typebox'
import envSchema from 'env-schema'
import { createRequire } from 'node:module'
import { StringEnum } from '../../shared/schema/index.js'

const require = createRequire(import.meta.url)

const ConfigSchema = Type.Object({
	NODE_ENV: StringEnum(['development', 'production', 'test', 'local']),
	SERVER_PORT: Type.Number(),
	DATABASE_URL: Type.String({ format: 'uri' }),
	AUTH_JWT_SECRET: Type.String({ minLength: 10 }),
	JWT_EXPIRES_IN: Type.Number(),
	RESEND_API_KEY: Type.String(),
	REDIS_URL: Type.String({ format: 'uri' }),
	MONGO_URI: Type.String(),
	MONGO_STORE: Type.String(),
	SEVER_LOG_LEVEL: Type.Optional(Type.String(StringEnum(['info', 'error', 'debug']))),
})

type Config = Static<typeof ConfigSchema>

export const env = envSchema<Config>({
	schema: ConfigSchema,
	dotenv: true,
	ajv: {
		customOptions(ajvInstance) {
			const opts = [
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
			]
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			require('ajv-formats')(ajvInstance, opts)
			return ajvInstance
		},
	},
})
