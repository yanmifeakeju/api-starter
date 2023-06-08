import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { userRoutes } from './modules/users/users.routes.js';
import { createRequire } from 'module';
// import { schemaErrorMessageGenerator } from './utils/schema/errorMessage.js';
import fastifyJwt from '@fastify/jwt';
import { env } from './config/env.js';

const require = createRequire(import.meta.url);

const server = Fastify().withTypeProvider<TypeBoxTypeProvider>();

// server.setErrorHandler((error, request, reply) => {
//   if (error.validation) {
//     reply.status(400).send({
//       success: false,
//       error: schemaErrorMessageGenerator(error.validation)
//     });

//     return;
//   }

//   reply
//     .status(error.statusCode || 500)
//     .send({ success: false, error: error.message });
// });

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
