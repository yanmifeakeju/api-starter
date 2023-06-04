import type { FastifyZod } from 'fastify-zod';

// Global augmentation, as suggested by
// https://www.fastify.io/docs/latest/Reference/TypeScript/#creating-a-typescript-fastify-plugin
declare module 'fastify' {
  interface FastifyInstance {
    readonly zod: FastifyZod<typeof models>;
  }
}
