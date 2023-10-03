import { type TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { type FastifyInstance, type RouteHandler, type RouteHandlerMethod, type RouteOptions } from 'fastify'
import { fetchUserProfile, loginUser, registerUser } from './controllers.js'
import { CreateUserSchema, GetUserSchema, SignInUserSchema } from './schemas/index.js'

export default async (fastify: FastifyInstance) => {
	const server = fastify.withTypeProvider<TypeBoxTypeProvider>()

	server.register(
		async function(routePlugin) {
			const routes: RouteOptions[] = [
				{
					method: 'POST',
					url: '/',
					schema: CreateUserSchema,
					handler: registerUser as RouteHandler,
				},

				{
					method: 'GET',
					url: '/',
					schema: GetUserSchema,
					onRequest: [server.authenticate],
					handler: fetchUserProfile as RouteHandlerMethod,
				},

				{
					method: 'POST',
					url: '/sign_in',
					handler: loginUser as RouteHandlerMethod,
					schema: SignInUserSchema,
				},
			]

			routes.forEach((route) => routePlugin.route(route))
		},
	)
}
