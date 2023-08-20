import { type Static } from '@sinclair/typebox';
import { schemaValidator } from '../../../utils/validator.js';
import { createUserProfileSchema, findUserCredentialsSchema, findUserProfileSchema } from './schema.js';

export const validateCreateUserData = schemaValidator<Static<typeof createUserProfileSchema>>(
  createUserProfileSchema,
);

export const validateFindUserProfileData = schemaValidator<Static<typeof findUserProfileSchema>>(findUserProfileSchema);
export const validateCheckUserCredentialsSchema = schemaValidator<Static<typeof findUserCredentialsSchema>>(
  findUserCredentialsSchema,
);
