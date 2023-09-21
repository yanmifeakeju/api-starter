import createConnectionPool, { type ConnectionPool, sql } from '@databases/pg'
import tables from '@databases/pg-typed'
import { createRequire } from 'module'
import { env } from '../../config/env'
import type DatabaseSchema from './schema'

const db: ConnectionPool = createConnectionPool({ connectionString: env.DATABASE_URL, bigIntMode: 'bigint' })

const require = createRequire(import.meta.url)

const { users } = tables<DatabaseSchema>({
  databaseSchema: require('./schema/schema.json'),
})

export default db
export { sql, users }
