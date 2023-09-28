import { AppError } from '../../shared/error/AppError.js'
import { createQueue, createWorker } from '../bullmq/index.js'
import { type EventDataProps, type EventHandlers, type EventMap } from './types.js'

export const eventQueueName = 'events'
const queue = createQueue(eventQueueName)

/**
 * Adds an event to the queue for processing.
 *
 * @param {keyof EventDataProps} eventType - The type of the event.
 * @param {EventMap[keyof EventDataProps]} eventData - The event data to be processed.
 * @returns {Promise<void>} - Resolves when the event is added to the queue.
 */
export async function addEventToQueue<T extends keyof EventDataProps>(
	eventType: T,
	eventData: EventMap[T],
): Promise<void> {
	try {
		await queue.add(eventType, { ...eventData, type: eventType })
	} catch (error) {
		// Implement a log aggregator for recording failed jobs.
		console.error(
			`${eventData.timestamp}: Adding ${eventType} for ${eventData.userId} to queue failed || ${
				(error as Error).message || JSON.stringify(error)
			}`,
		)

		// throw error
		// Usually I don't throw error and I want an external tool to send alerts for this.
	}
}

type EventTypes = keyof EventDataProps

const eventHandlers: EventHandlers = {
	USER_REGISTERED: async ({ type, timestamp, userId, data }) => {
		console.log('Processing USER_REGISTERED event', type, timestamp, userId, data)
	},

	USER_LOGGED_IN: async ({ type, timestamp, userId, data }) => {
		console.log('Processing USER_LOGGED_IN event', type, timestamp, userId, data)
	},
}

async function processEvent<T extends EventTypes>(eventType: T, data: EventMap[T]): Promise<void> {
	const handler = eventHandlers[eventType]
	if (handler) await handler({ ...data, type: eventType })
	else throw new AppError('FATAL', `No registered handler for ${eventType}`)
}

export const processEventQueue = () =>
	createWorker<EventMap[EventTypes] & { type: EventTypes }, void>(eventQueueName, async (job) => {
		console.log(`Processing ${job.data.type}: [TIMESTAMP ${job.data.timestamp}] [USER_ID: ${job.data.userId}]`)
		await processEvent(job.data.type, job.data)
	})
