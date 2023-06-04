import Fastify from 'fastify';
import { userRoutes } from './modules/users/users.routes.js';
import { createRequire } from 'module';
import { schemaErrorMessageGenerator } from './utils/schema/errorMessage.js';

const require = createRequire(import.meta.url);

const fastify = Fastify({
  ajv: {
    customOptions: {
      allErrors: true
    },
    plugins: [require('ajv-errors')]
  }
});

fastify.setErrorHandler((error, request, reply) => {
  if (error.validation) {
    reply.status(400).send({
      success: false,
      error: schemaErrorMessageGenerator(error.validation)
    });

    return;
  }

  reply
    .status(error.statusCode || 500)
    .send({ success: false, error: error.message });
});

fastify.get('/health-check', async () => {
  return { status: 'OK' };
});

await fastify.register(userRoutes, { prefix: 'api/users' });

async function main() {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server up.');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

main();
