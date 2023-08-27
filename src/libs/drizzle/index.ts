import { drizzle } from 'drizzle-orm/postgres-js';
import * as Postgres from 'postgres';
import { env } from '../../config/env.js';
import * as schema from '../../db/schema/index.js';

const postgres = Postgres.default;

const client = postgres(env.DATABASE_URL);
export const db = drizzle(client, { schema, logger: true });
