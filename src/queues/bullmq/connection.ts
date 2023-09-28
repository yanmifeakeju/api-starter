import { Redis } from 'ioredis'
import { env } from '../../config/env/env.js'

const connection = new Redis(env.REDIS_URL, { maxRetriesPerRequest: null, lazyConnect: true })

connection.on('connect', () => {
	console.log('BULL CONNECTED')
})

export { connection }
