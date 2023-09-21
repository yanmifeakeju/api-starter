import { env } from '../../config/env.js'
import db from '../../databases/postgres/connection.js'
import { app } from './index.js'

const server = await app()
server.log.info(`Sever running on ${env.NODE_ENV.toUpperCase()} environment`)
await server.listen({ port: env.SERVER_PORT, host: '0.0.0.0' })

process.once('SIGTERM', () => {
  db.dispose().catch((ex) => console.error(ex))
  server.close().catch((ex) => console.error(ex))
})
