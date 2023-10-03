import AutoLoad from '@fastify/autoload'
import { type TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import Fastify, { type FastifyInstance } from 'fastify'
import path from 'path'
import { fileURLToPath } from 'url'
import serverOptions from './configs/server-options.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const fastify = Fastify(serverOptions).withTypeProvider<TypeBoxTypeProvider>()

export const app = async (): Promise<FastifyInstance> => {
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
	return fastify
}
