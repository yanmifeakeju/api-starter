import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { dirname, join } from 'path'
import postgres from 'postgres'
import { fileURLToPath } from 'url'
import { env } from '../config/env.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

console.log(join(__dirname, './migrations'))

const sql = postgres(env.DATABASE_URL, { max: 1 })
const db = drizzle(sql)

await migrate(db, {
  migrationsFolder: join(__dirname, '../../', 'src/db/migrations/'),
})

process.exit(0)
