import Fastify from 'fastify';
import { userRoutes } from './modules/users/users.routes.js';
import { userSchemas } from './modules/users/users.schema.js';

const server = Fastify();

server.get('/health-check', async () => {
  return { status: 'OK' };
});

for (const schema of userSchemas) {
  server.addSchema(schema);
}

server.register(userRoutes, { prefix: 'api/users' });

async function main() {
  try {
    await server.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server up.');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

await main();
