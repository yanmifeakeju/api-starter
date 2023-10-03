import { UserModule, type UserTypes } from '../../../core/index.js'
import { addEventToQueue } from '../../../queues/events/events.js'

export const loginUser = async (data: Pick<UserTypes.User, 'email' | 'password'>) => {
	const user = await UserModule.findWithCredentials(data)

	const lastLogin = new Date()
	await UserModule.updateLastLoginTime(user, lastLogin)

	addEventToQueue('USER_LOGGED_IN', { userId: user.userId, timestamp: new Date(), data: { lastLogin } })

	return { ...user, lastLogin }
}

export const getAuthUser = async (userId: string) => {
	return UserModule.findUnique({ userId })
}

export const initiateForgotPasswordRequest = async (_email: string) => {
	throw new Error('Unimplemented')
}

export const completeForgotPasswordRequest = async (_token: string) => {
	throw new Error('Unimplemented')
}

export const changeUserPassword = async (_password: string) => {
	throw new Error('Unimplemented')
}
