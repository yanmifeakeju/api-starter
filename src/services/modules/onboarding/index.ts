import { UserModule, type UserTypes, UserValidator } from '../../../core/index.js'
import { addEventToQueue } from '../../../queues/events/events.js'
import { AppError } from '../../../utils/error/AppError.js'

export const registerUser = async (
	data: Omit<UserTypes.UserProfile & { password: string }, 'lastLogin' | 'userId'>,
) => {
	const { email, password, username, phone } = UserValidator.validateCreateUserData(data)

	const existingUser = await UserModule.find({ email, username, phone })
	if (existingUser) throw new AppError('DUPLICATE_ENTRY', 'Email, username, or phone is already taken.')

	const user = await UserModule.create({ email, password, username, phone })

	addEventToQueue('USER_REGISTERED', { timestamp: new Date(), userId: user.userId, data: { email, phone, username } })

	return user
}

export const completeUserVerification = async () => {}
