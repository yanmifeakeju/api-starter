import { type InferModel, relations } from 'drizzle-orm';

import { integer, pgTable, serial, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

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
  updatedAt: timestamp('updated_at'),
});

export const usersCredentials = pgTable('users_credentials', {
  id: serial('id').primaryKey().notNull(),
  password: text('password').notNull(),
  userId: integer('user_id').references(() => users.id),
});

// Define Relations
export const userRelations = relations(users, ({ one }) => ({
  userCredentials: one(usersCredentials, {
    fields: [users.id],
    references: [usersCredentials.userId],
  }),
}));

export type ISaveUserEntity = Omit<InferModel<typeof users, 'insert'>, 'id'>;
export type IUserEntity = Omit<InferModel<typeof users, 'select'>, 'id'>;
