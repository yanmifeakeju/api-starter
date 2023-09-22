import { type Static } from '@sinclair/typebox'
import { schemaValidator } from '../../../utils/validator.js'
import {
  createUserProfileSchema,
  findUniqueUserSchema,
  findUserCredentialsSchema,
  findUserProfileSchema,
} from './schema.js'

export const validateCreateUserData = schemaValidator<Static<typeof createUserProfileSchema>>(
  createUserProfileSchema,
)

export const validateFindUserProfileData = schemaValidator<Static<typeof findUserProfileSchema>>(findUserProfileSchema)
export const validateFindUserCredentialsData = schemaValidator<Static<typeof findUserCredentialsSchema>>(
  findUserCredentialsSchema,
)

export const validateFindUniqueUserData = schemaValidator<Static<typeof findUniqueUserSchema>>(
  findUniqueUserSchema,
)
