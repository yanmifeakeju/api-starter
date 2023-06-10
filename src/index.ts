import Fastify from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { userRoutes } from './modules/users/users.routes.js';
import { createRequire } from 'module';
import { env } from './config/env.js';
import { schemaErrorMessageGenerator } from './utils/error-message.js';
import { AppError } from './shared/error/AppError.js';
import { mapAppErrorToApiError } from './utils/errors.js';

const require = createRequire(import.meta.url);

const server = Fastify().withTypeProvider<TypeBoxTypeProvider>();

server.setErrorHandler((error, request, reply) => {
  let err = {
    statusCode: error.statusCode || 500,
    error: error.message || 'Oops. Something went wrong.'
  };
  if (error.validation) {
    err.statusCode = 400;
    err.error = schemaErrorMessageGenerator(error.validation);
  }

  if (error instanceof AppError) {
    const appErrorToApiError = mapAppErrorToApiError(error);
    err.statusCode = appErrorToApiError.statusCode;
    err.error = appErrorToApiError.message;
  }

  reply.status(err.statusCode).send({ success: false, error: err.error });
});

server.get('/health-check', async () => {
  return { status: 'OK' };
});

await server.register(userRoutes, { prefix: 'api/users' });

async function main() {
  try {
    await server.listen({ port: env.SERVER_PORT, host: '0.0.0.0' });
    console.log('Server up.');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

main();
