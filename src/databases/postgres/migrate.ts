import { dirname } from 'path'
import pg from 'pg'
import Postgrator from 'postgrator'
import { fileURLToPath } from 'url'
import { env } from '../../config/env'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function main() {
  const client = new pg.Client({
    connectionString: env.DATABASE_URL,
  })

  try {
    await client.connect()

    const postgrator = new Postgrator({
      migrationPattern: __dirname + '/migrations/*',
      driver: 'pg',
      execQuery: (query) => client.query(query),
    })

    postgrator.on('validation-started', (migration) => console.log(migration))
    postgrator.on('validation-finished', (migration) => console.log(migration))
    postgrator.on('migration-started', (migration) => console.log(migration))
    postgrator.on('migration-finished', (migration) => console.log(migration))

    // Migrate to specific version
    // const appliedMigrations = await postgrator.migrate('002')
    // console.log(appliedMigrations)

    const appliedMigrations = await postgrator.migrate()
    console.log(__dirname)
    console.log(appliedMigrations)
  } catch (error) {
    const err = error as unknown as { appliedMigrations: unknown[] }
    console.error('failed', err.appliedMigrations) // array of migration objects
  }

  await client.end()
}

await main()
