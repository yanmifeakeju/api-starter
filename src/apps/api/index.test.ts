import { type FastifyInstance } from 'fastify'
import { afterAll, beforeAll, expect, test } from 'vitest'
import { app } from './index.js'

let server: FastifyInstance

beforeAll(async () => {
	server = await app()
})

afterAll(async () => {
	server.close()
})

test('should return OK', async () => {
	const response = await server.inject({ url: '/health-check' })
	const data = response.json()
	expect(data.status).toBe('OK')
	await server.close()
})
