import { type Job, Queue, Worker } from 'bullmq'
import { logger } from '../../shared/logger/pino.js'
import { connection } from './connection.js'

export const createQueue = <T>(queueName: string) => {
	return new Queue<T>(queueName, { connection })
}

type Handler<T, U> = (job: Job<T, U>) => Promise<U>

export const createWorker = <T, U>(queueName: string, handler: Handler<T, U>) => {
	const worker = new Worker(queueName, handler, {
		connection,
		removeOnComplete: { age: 3600 * 24, count: 5000 },
		removeOnFail: { age: 3600 * 24 * 3, count: 10000 },
	})

	worker.on('completed', (job) => logger.info(`${job.id} has completed`))
	worker.on('failed', (job) => logger.info(`${job?.name} has failed`))

	return worker
}
