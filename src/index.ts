import Fastify from 'fastify';

const server = Fastify();

server.get('/health-check', async () => {
  return { status: 'OK' };
});

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
