import createConnectionPool, { type ConnectionPool, sql } from '@databases/pg'
import tables from '@databases/pg-typed'
import { createRequire } from 'module'
import { env } from '../../config/env.js'
import type DatabaseSchema from './schema/index.js'

const noLogEnvs = ['test', 'production']

const db: ConnectionPool = createConnectionPool.default({
  connectionString: env.DATABASE_URL,
  bigIntMode: 'bigint',
  onQueryStart: (_query, { text, values }) => {
    if (!noLogEnvs.includes(env.NODE_ENV)) {
      console.log(
        `${env.NODE_ENV.toUpperCase()}: ${new Date().toISOString()} START QUERY ${text} - ${
          JSON.stringify(
            values,
          )
        }`,
      )
    }
  },
  onQueryResults: (_query, { text }, results) => {
    if (!noLogEnvs.includes(env.NODE_ENV)) {
      console.log(
        `${env.NODE_ENV.toUpperCase()}: ${new Date().toISOString()} END QUERY   ${text} - ${results.length} results`,
      )
    }
  },

  onQueryError: (_query, { text }, err) => {
    console.log(
      `${env.NODE_ENV.toUpperCase()}: ${new Date().toISOString()} ERROR QUERY ${text} - ${err.message}`,
    )
  },
})

const require = createRequire(import.meta.url)

const { users, user_credentials } = tables.default<DatabaseSchema.default>({
  databaseSchema: require('./schema/schema.json'),
})

export default db

export { sql, user_credentials, users }
