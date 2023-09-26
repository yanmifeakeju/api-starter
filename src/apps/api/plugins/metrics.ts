import Fastify from 'fastify'
import fastifyMetrics from 'fastify-metrics'
import fastifyPlugin from 'fastify-plugin'

export default fastifyPlugin(async function(app) {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	app.register(fastifyMetrics, {
		defaultMetric: { enabled: true },
		endpoint: null,
		name: 'metrics',
		routeMetrics: { enabled: true },
	})

	const promServer = Fastify({ logger: app.log })

	promServer.route({
		url: '/metrics',
		method: 'GET',
		logLevel: 'info',
		handler: (_, reply) => {
			reply.type('text/plain')
			return app.metrics.client.register.metrics()
		},
	})

	app.addHook('onClose', async (_instance) => await promServer.close())
	await promServer.listen({ port: 9001, host: '0.0.0.0' })
})
