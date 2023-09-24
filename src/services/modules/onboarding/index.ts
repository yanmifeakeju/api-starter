import { UserModule, type UserTypes, UserValidator } from '../../../core/index.js'
import { AppError } from '../../../shared/error/AppError.js'

export const registerUser = async (
	data: Omit<UserTypes.UserProfile & { password: string }, 'lastLogin' | 'userId'>,
) => {
	const { email, password, username, phone } = UserValidator.validateCreateUserData(data)

	const existingUser = await UserModule.find({ email, username, phone })
	if (existingUser) throw new AppError('DUPLICATE_ENTRY', 'Email, username, or phone is already taken.')

	return UserModule.create({ email, password, username, phone })
}

export const completeUserVerification = async () => {}
