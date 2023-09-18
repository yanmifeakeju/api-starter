import { Type } from '@fastify/type-provider-typebox'
import { UsersSchema } from '../../../../../core/index.js'
import { BaseResponseSchema } from '../../../schemas/index.js'

export const CreateUserSchema = {
  body: UsersSchema.createUserProfileSchema,
  response: {
    201: Type.Intersect([
      BaseResponseSchema,
      Type.Object({
        data: Type.Object({
          session: Type.Object({
            authToken: Type.String(),
          }),
        }),
      }),
    ]),
  },
}

export const GetUserSchema = {
  response: {
    200: Type.Intersect([
      BaseResponseSchema,
      Type.Object({
        data: UsersSchema.userProfileSchema,
      }),
    ]),
  },
}

export const SignInUserSchema = {
  body: UsersSchema.userAuthSchema,
  response: {
    200: Type.Intersect([
      BaseResponseSchema,
      Type.Object({
        data: Type.Object({
          session: Type.Object({
            authToken: Type.String(),
          }),
        }),
      }),
    ]),
  },
}
