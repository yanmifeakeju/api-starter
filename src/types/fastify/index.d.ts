import {
  type ContextConfigDefault,
  type FastifyReply,
  type FastifyRequest,
  type RawReplyDefaultExpression,
  type RawRequestDefaultExpression,
  type RawServerDefault,
} from 'fastify';

import { type TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { type RouteGenericInterface } from 'fastify/types/route';
import { type FastifySchema } from 'fastify/types/schema';
import { Server } from 'http';

// Global augmentation, as suggested by
// https://www.fastify.io/docs/latest/Reference/TypeScript/#creating-a-typescript-fastify-plugin
declare module 'fastify' {
  Server;
  export interface FastifyInstance<RawServer, RawRequest, RawReply, Logger, TypeProvider> {
    authenticate(): Promise<void>;
  }

  export interface FastifyRequest {}
}

export type FastifyRequestTypebox<TSchema extends FastifySchema> = FastifyRequest<
  RouteGenericInterface,
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  TSchema,
  TypeBoxTypeProvider
>;

export type FastifyReplyTypebox<TSchema extends FastifySchema> = FastifyReply<
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  RouteGenericInterface,
  ContextConfigDefault,
  TSchema,
  TypeBoxTypeProvider
>;
