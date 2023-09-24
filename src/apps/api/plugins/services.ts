import fastifyPlugin from 'fastify-plugin'
import { AuthService, OnboardingService } from '../../../services/modules/index.js'

type Services = {
	onboarding: typeof OnboardingService
	auth: typeof AuthService
}

declare module 'fastify' {
	export interface FastifyInstance {
		services: Services
	}
}

export default fastifyPlugin(async function(fastify, _opts) {
	fastify.decorate('services', {
		onboarding: OnboardingService,
		auth: AuthService,
	})
})
