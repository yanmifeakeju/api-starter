import { Type } from '@fastify/type-provider-typebox'

export const BaseResponseSchema = Type.Object({
  success: Type.Literal(true),
  message: Type.String(),
})

export const ErrorResponseSchema = Type.Object({
  success: Type.Literal(false),
  error: Type.String(),
})
