import { Type } from '@sinclair/typebox'
import { DateSchema } from '../../../shared/schema/index.js'

export const UserSchema = Type.Object(
	{
		id: Type.Number(),
		userId: Type.String({ format: 'uuid' }),
		email: Type.String({ format: 'email' }),
		username: Type.String({ minLength: 2, maxLength: 15 }),
		password: Type.String({ minLength: 8 }),
		phone: Type.String({
			maxLength: 11,
			minLength: 11,
		}),
		lastLogin: DateSchema,
	},
	{ additionalProperties: false },
)

export const userProfileSchema = Type.Pick(UserSchema, ['userId', 'email', 'username', 'lastLogin', 'phone'])
export const createUserProfileSchema = Type.Pick(UserSchema, ['email', 'password', 'username', 'phone'])
export const findUserProfileSchema = Type.Pick(Type.Partial(UserSchema), ['email', 'username', 'phone'])
export const findUserCredentialsSchema = Type.Pick(UserSchema, ['email', 'password'])
export const findUniqueUserSchema = Type.Pick(Type.Partial(UserSchema), ['username', 'email', 'userId'])
export const userAuthSchema = Type.Pick(UserSchema, ['email', 'password'])
