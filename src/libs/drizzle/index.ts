import { sql } from 'drizzle-orm';
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as Postgres from 'postgres';
import { env } from '../../config/env.js';
import * as schema from '../../db/schema/index.js';

const postgres = Postgres.default;

const client = postgres(env.DATABASE_URL, { max: 1 });
export const db = drizzle(client, { schema, logger: true });

export async function transaction<T>(
  run: (tx: PostgresJsDatabase) => Promise<T>,
) {
  const client = postgres(env.DATABASE_URL, { max: 1 });
  const tx = drizzle(client, { logger: true });

  try {
    await tx.execute(sql`BEGIN`);
    const result = await run(tx);
    await tx.execute(sql`COMMIT`);

    return result;
  } catch (err) {
    await tx.execute(sql`ROLLBACK`);
    throw err;
  } finally {
    client.end();
  }
}
