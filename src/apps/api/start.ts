import { env } from '../../config/env.js'
import { app } from './index.js'

const server = await app()
await server.listen({ port: env.SERVER_PORT, host: '0.0.0.0' })
