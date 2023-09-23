import { env } from '../../config/env.js'
import db, { sql } from '../../databases/postgres/index.js'
import { app } from './index.js'

await db.query(sql`SELECT 1+ 1`)

const server = await app()
server.log.info(`Sever running on ${env.NODE_ENV.toUpperCase()} environment`)
await server.listen({ port: env.SERVER_PORT, host: '0.0.0.0' })

process.once('SIGTERM', () => {
  db.dispose().catch((ex) => console.error(ex))
  server.close().catch((ex) => console.error(ex))
})
