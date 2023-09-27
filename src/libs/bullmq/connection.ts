import { Redis } from 'ioredis'

const connection = new Redis({ maxRetriesPerRequest: null, lazyConnect: true })

connection.on('connect', () => {
	console.log('connected')
})

export { connection }
