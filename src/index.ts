import Fastify from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { userRoutes } from './apis/http/users/users.routes.js';
import { schemaErrorMessageGenerator } from './utils/error-message.js';
import { AppError } from './shared/error/AppError.js';
import { mapAppErrorToApiError } from './utils/errors.js';
import authentication from './plugins/authentication.js';
import { env } from './config/env.js';
import swagger from './plugins/swagger.js';

const server = Fastify({
  logger: true
}).withTypeProvider<TypeBoxTypeProvider>();

await server.register(authentication);
await server.register(swagger);

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

  return reply
    .status(err.statusCode)
    .send({ success: false, error: err.error });
});

server.get('/health-check', async () => {
  return { status: 'OK' };
});

await server.register(userRoutes, { prefix: 'api/users' });

await server.ready();
// server.swagger();

async function main() {
  try {
    await server.listen({ port: env.SERVER_PORT, host: '0.0.0.0' });
    console.info('Server up.');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
