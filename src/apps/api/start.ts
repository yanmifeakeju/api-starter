import { env } from '../../config/env/env.js'
import db, { sql } from '../../infrastructure/databases/postgres/index.js'
import { logger } from '../../shared/logger/pino.js'
import { app } from './index.js'

const server = await app()

try {
	await db.query(sql`SELECT 1+ 1`)
	await server.listen({ port: env.SERVER_PORT, host: '0.0.0.0' })
} catch (error) {
	logger.error(error)
	process.exit(1)
}

process.once('SIGTERM', () => {
	logger.info('CLOSING')
	db.dispose().catch((ex) => logger.error(ex))
	server.close().catch((ex) => logger.error(ex))
})
