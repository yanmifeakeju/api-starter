import { type OnlyOneProperty } from '../../../@types/util-types/index.js'
import db from '../../../infrastructure/databases/postgres/index.js'
import { AppError } from '../../../utils/error/AppError.js'
import { moduleAsyncWrapper } from '../../../utils/module-wrapper.js'
import { hashPassword, verifyPassword } from '../../../utils/password.js'
import { fetchUniqueUser, fetchUser, fetchUserAuthCredentials, saveUser, updateLastLogin } from './repository.js'
import { type User, type UserProfile } from './types.js'

import {
	validateCreateUserData,
	validateFindUniqueUserData,
	validateFindUserCredentialsData,
	validateFindUserProfileData,
} from './validators.js'

const wrapper = moduleAsyncWrapper('users')

export const create = wrapper(
	async (input: Omit<User, 'userId' | 'lastLogin' | 'id'>): Promise<UserProfile> => {
		const { email, password, username, phone } = validateCreateUserData(input)
		return saveUser({ email, password: await hashPassword(password), username, phone }, db)
	},
)

export const find = wrapper(
	async (input: Partial<Pick<User, 'email' | 'username' | 'phone'>>): Promise<UserProfile | null> => {
		const data = validateFindUserProfileData(input)
		return fetchUser(data, db)
	},
)

export const findUnique = wrapper(
	async (input: OnlyOneProperty<Pick<User, 'email' | 'username' | 'userId' | 'phone'>>): Promise<UserProfile> => {
		validateFindUniqueUserData(input)
		const user = await fetchUniqueUser(input, db)

		if (!user) throw new AppError('NOT_FOUND', 'User not found.')

		return user
	},
)

export const findWithCredentials = wrapper(
	async (input: Pick<User, 'email' | 'password'>): Promise<UserProfile> => {
		const data = validateFindUserCredentialsData(input)
		const result = await fetchUserAuthCredentials({ email: data.email, credentialType: 'password' }, db)

		if (!result) throw new AppError('INVALID_ARGUMENT', 'Invalid credentials.')

		const isUserCreds = await verifyPassword(data.password, result.credentialValue)
		if (!isUserCreds) throw new AppError('INVALID_ARGUMENT', 'Invalid credentials.')

		return result
	},
)

export const updateLastLoginTime = wrapper(async ({ userId, lastLogin }: UserProfile, time: Date) => {
	return updateLastLogin(userId, { currentLogin: time, previousLogin: lastLogin }, db)
})
