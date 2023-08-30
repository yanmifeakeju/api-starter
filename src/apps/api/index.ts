import { type TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import Fastify from 'fastify';
import { env } from '../../config/env.js';
import { AppError } from '../../shared/error/AppError.js';
import { generateSchemaErrorMessage } from '../../utils/error-message.js';
import { mapAppErrorToApiError } from '../../utils/errors.js';
import authentication from './plugins/authentication.js';
import swagger from './plugins/swagger.js';
import { userRoutes } from './users/users.routes.js';

export const getServer = async () => {
  const logger = env.NODE_ENV! === 'production'
    ? { level: 'debug', transport: { target: 'pino-pretty' } }
    : { level: 'info' };

  const app = Fastify({
    ignoreTrailingSlash: true,
    schemaErrorFormatter: function(errors, _httpPart) {
      const error = generateSchemaErrorMessage(errors);
      return new Error(error);
    },
    logger,
  }).withTypeProvider<TypeBoxTypeProvider>();

  await app.register(authentication).register(swagger);

  app.setErrorHandler((error, request, reply) => {
    request.log.error(error);

    const err = {
      statusCode: error.statusCode,
      error: error.message,
    };

    if (error instanceof AppError) {
      const appErrorToApiError = mapAppErrorToApiError(error);
      err.statusCode = appErrorToApiError.statusCode;
      err.error = appErrorToApiError.message;
    }

    return reply
      .status(err.statusCode || 500)
      .send({ success: false, error: err.statusCode ? err.error : 'Oops. Something went wrong.' });
  });

  app.get('/health-check', async () => {
    return { status: 'OK' };
  });

  await app.register(userRoutes, { prefix: 'api/v1' }); // /users;

  app.swagger();
  await app.ready();

  return app;
};

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const server = await getServer();
  await server.listen({ port: env.SERVER_PORT, host: '0.0.0.0' });
}
