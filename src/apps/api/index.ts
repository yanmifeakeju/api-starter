import Fastify from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { userRoutes } from './users/users.routes.js';
import { schemaErrorMessageGenerator } from '../../utils/error-message.js';
import { AppError } from '../../shared/error/AppError.js';
import { mapAppErrorToApiError } from '../../utils/errors.js';
import authentication from './plugins/authentication.js';
import { env } from '../../config/env.js';
import swagger from './plugins/swagger.js';

const app = Fastify({
  ignoreTrailingSlash: true,
  logger: {
    level: 'debug',
    transport: { target: 'pino-pretty' }
  }
}).withTypeProvider<TypeBoxTypeProvider>();

await app.register(authentication).register(swagger);

app.setErrorHandler((error, request, reply) => {
  request.log.error('An error ocurred', error);

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

app.setNotFoundHandler(function notFound(request, reply) {
  const payload = {
    success: false,
    message: `Route ${request.method}: ${request.url} not found`
  };

  reply.status(404).send(payload);
});

app.get('/health-check', async () => {
  return { status: 'OK' };
});

await app.register(userRoutes, { prefix: 'api/v1' }); // /users;

app.swagger();
await app.ready();

async function main() {
  try {
    await app.listen({ port: env.SERVER_PORT, host: '0.0.0.0' });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
