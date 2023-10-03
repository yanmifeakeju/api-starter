import { Redis } from 'ioredis'
import { env } from '../../config/env/env.js'
import { logger } from '../../shared/logger/pino.js'

const connection = new Redis(env.REDIS_URL, { maxRetriesPerRequest: null, lazyConnect: true })

connection.on('connect', () => {
	logger.info('BULL CONNECTED')
})

export { connection }
