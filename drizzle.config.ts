import 'dotenv/config'
import type { Config } from 'drizzle-kit'

const env = process.env.NODE_ENV
// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require(`./src/config/${env}.config.json`) // Issues with esm and drizzle

export default {
  schema: ['./src/db/schema/*'],
  out: './src/db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: config.DATABASE_URL,
  },
} satisfies Config
