import { type Static } from '@sinclair/typebox'
import { type userProfileSchema, type UserSchema } from './schema.js'

export type User = Static<typeof UserSchema>
export type UserProfile = Static<typeof userProfileSchema>
