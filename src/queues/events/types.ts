import { type UserTypes } from '../../core/index.js'

type EventData = {
	userId: string
	timestamp: Date
}

export type EventDataProps = {
	USER_REGISTERED: Pick<UserTypes.UserProfile, 'username' | 'phone' | 'email'>
	USER_LOGGED_IN: Pick<UserTypes.UserProfile, 'lastLogin'>
}

export type EventMap = {
	[EventType in keyof EventDataProps]:
		& EventData
		& (EventDataProps[EventType] extends never ? Record<string, never> : { data: EventDataProps[EventType] })
}

export type QueueProcessors = {
	[EventType in keyof EventDataProps]: (
		data: EventMap[EventType] & { type: EventType },
	) => void
}
export type EventHandlers = {
	[EventType in keyof EventDataProps]: (
		data: EventMap[EventType] & { type: EventType },
	) => Promise<void>
}
