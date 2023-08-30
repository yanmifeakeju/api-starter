import { type FastifyInstance } from 'fastify';
import { afterAll, beforeAll, expect, test } from 'vitest';
import { getServer } from './index.js';

let app: FastifyInstance;

beforeAll(async () => {
  app = await getServer();
});

afterAll(async () => {
  app.close();
});

test('should return OK', async () => {
  const response = await app.inject({ url: '/health-check' });
  const data = response.json();
  expect(data.status).toBe('OK');
  await app.close();
});
