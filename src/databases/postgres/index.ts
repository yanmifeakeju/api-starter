import createConnectionPool, { type ConnectionPool, sql } from '@databases/pg'
import tables from '@databases/pg-typed'
import { createRequire } from 'module'
import { env } from '../../config/env'
import type DatabaseSchema from './schema'

const db: ConnectionPool = createConnectionPool({
  connectionString: env.DATABASE_URL,
  bigIntMode: 'bigint',
  onQueryStart: (_query, { text, values }) => {
    console.log(
      `${new Date().toISOString()} START QUERY ${text} - ${
        JSON.stringify(
          values,
        )
      }`,
    )
  },
  onQueryResults: (_query, { text }, results) => {
    console.log(
      `${new Date().toISOString()} END QUERY   ${text} - ${results.length} results`,
    )
  },

  onQueryError: (_query, { text }, err) => {
    console.log(
      `${new Date().toISOString()} ERROR QUERY ${text} - ${err.message}`,
    )
  },
})

const require = createRequire(import.meta.url)

const { users, user_credentials } = tables<DatabaseSchema>({
  databaseSchema: require('./schema/schema.json'),
})

export default db

export { sql, user_credentials, users }
