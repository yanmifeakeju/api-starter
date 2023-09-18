import { type InferInsertModel, type InferSelectModel, relations, sql } from 'drizzle-orm'

import { integer, pgTable, serial, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey().notNull(),
  userId: uuid('user_uuid').defaultRandom().unique().notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  username: varchar('username', { length: 20 }).unique().notNull(),
  phone: varchar('phone', { length: 30 }),
  createdAt: timestamp('created_at', { precision: 3, mode: 'date' })
    .defaultNow()
    .notNull(),
  deletedAt: timestamp('deleted_at', { precision: 3, mode: 'date' }),
  lastLogin: timestamp('last_login', { precision: 3, mode: 'date' })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { precision: 3, mode: 'date' }).default(
    sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`,
  ).notNull(),
})

export const usersCredentials = pgTable('users_credentials', {
  id: serial('id').primaryKey().notNull(),
  password: text('password').notNull(),
  userId: integer('user_id').references(() => users.id),
})

// Define Relations
export const userRelations = relations(users, ({ one }) => ({
  userCredentials: one(usersCredentials, {
    fields: [users.id],
    references: [usersCredentials.userId],
  }),
}))

export type ISaveUserEntity = Omit<
  InferInsertModel<typeof users>,
  'id' | 'lastLogin' | 'createdAt' | 'deletedAt' | 'userId' | 'updatedAt'
>

export type IUserEntity = Omit<
  InferSelectModel<typeof users>,
  'id' | 'createdAt' | 'deletedAt' | 'updatedAt'
>
