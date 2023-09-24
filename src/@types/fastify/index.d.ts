import { type TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import {
	type ContextConfigDefault,
	type FastifyReply,
	type FastifyRequest,
	type FastifyTypeProvider,
	type RawReplyDefaultExpression,
	type RawRequestDefaultExpression,
	type RawServerDefault,
} from 'fastify'
import { type RouteGenericInterface } from 'fastify/types/route'
import { type FastifySchema } from 'fastify/types/schema'

export type FastifyRequestTypebox<TSchema extends FastifySchema> = FastifyRequest<
	RouteGenericInterface,
	RawServerDefault,
	RawRequestDefaultExpression<RawServerDefault>,
	TSchema,
	TypeBoxTypeProvider
>

export type FastifyReplyTypebox<TSchema extends FastifySchema> = FastifyReply<
	RawServerDefault,
	RawRequestDefaultExpression,
	RawReplyDefaultExpression,
	RouteGenericInterface,
	ContextConfigDefault,
	TSchema,
	TypeBoxTypeProvider
>

export type FastifyRequestInferred<
	Provider extends FastifyTypeProvider,
	Schema extends FastifySchema,
> = FastifyRequest<Record<unknown, unknown>, NonNullable<unknown>, NonNullable<unknown>, Schema, Provider>

export type FastifyReplyInferred<
	Provider extends FastifyTypeProvider,
	Schema extends FastifySchema,
> = FastifyReply<
	RawServerDefault,
	RawRequestDefaultExpression,
	RawReplyDefaultExpression,
	RouteGenericInterface,
	ContextConfigDefault,
	Schema,
	Provider
>
