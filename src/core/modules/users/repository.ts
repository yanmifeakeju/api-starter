import { sql, type Transaction } from '@databases/pg'
import { anyOf, greaterThan, or } from '@databases/pg-typed'
import { type OnlyOneProperty } from '../../../@types/util-types'
import db, { user_credentials, users } from '../../../databases/postgres'
import { type UserCredentials } from '../../../databases/postgres/schema'
import { type User, type UserProfile } from './types'

export const saveUser = async ({
  email,
  username,
  password,
  phone,
}: Pick<User, 'email' | 'username' | 'password' | 'phone'>): Promise<UserProfile> => {
  const user = await db.tx(async (connection: Transaction) => {
    const user = await users(connection).insert({
      email,
      username,
      phone,
    })

    await user_credentials(connection).insert({
      credential_type: 'password',
      credential_value: password,
      user_id: user[0].id,
    })

    return user[0]
  })

  return {
    email: user.email,
    lastLogin: user.last_login!,
    userId: user.user_id!,
    username: user.username,
    phone: user.phone,
  }
}

// Type this to be at least one
export const fetchUser = async ({
  email,
  username,
  phone,
}: Partial<Omit<UserProfile, 'lastLogin' | 'userId'>>): Promise<UserProfile | null> => {
  const user = await users(db).find(or({
    ...(email && { email }),
    ...(username && { username }),
    ...(phone && { phone }),
  })).andWhere({ deleted_at: null }).select('email', 'username', 'user_id', 'last_login', 'phone').one()

  return user && {
    email: user.email,
    lastLogin: user.last_login!,
    userId: user.user_id!,
    username: user.username,
    phone: user.phone,
  }
}

export const fetchUniqueUser = async ({
  email,
  userId,
  username,
  phone,
}: OnlyOneProperty<Omit<UserProfile, 'lastLogin'>>) => {
  const user = await users(db).find({
    ...(email && { email }),
    ...(username && { username }),
    ...(phone && { phone }),
    ...(userId && { user_id: userId }),
  }).andWhere({ deleted_at: null }).select('email', 'username', 'user_id', 'last_login', 'phone').one()

  return user && {
    email: user.email,
    lastLogin: user.last_login!,
    userId: user.user_id!,
    username: user.username,
    phone: user.phone,
  }
}

export const fetchUserById = async (userId: string) => {
  const user = await users(db).find({ user_id: userId }).andWhere({ deleted_at: null }).select(
    'email',
    'username',
    'user_id',
    'last_login',
    'phone',
  ).one()

  return user && {
    email: user.email,
    lastLogin: user.last_login!,
    userId: user.user_id!,
    username: user.username,
    phone: user.phone,
  }
}

type UserAuthCreds = UserProfile & { credentialValue: UserCredentials['credential_value'] }

export const fetchUserAuthCredentials = async (email: string, credentialType = 'password'): Promise<UserAuthCreds> => {
  const result = await db.query(sql`
    SELECT *
    FROM ${user_credentials(db).tableId} AS uc
    JOIN ${users(db).tableId} AS u
    ON uc.user_id = u.id
    WHERE ${users(db).conditionToSql({ email }, `u`)} AND ${users(db).conditionToSql({ deleted_at: null }, `u`)}
    AND ${user_credentials(db).conditionToSql({ credential_type: credentialType }, `uc`)}
  `)

  const data = result[0]

  if (!data) return data

  const user = {
    email: data.email,
    phone: data.phone,
    username: data.username,
    userId: data.user_id,
    lastLogin: data.last_login,
  }

  const credentialValue = data.credential_value
  return { ...user, credentialValue }
}

export const updateLastLogin = async (
  userId: string,
  { currentLogin, previousLogin }: { previousLogin: Date; currentLogin: Date },
) => {
  await db.tx(async (connection: Transaction) => {
    const user = await users(connection).update({
      last_login: anyOf([greaterThan(previousLogin), previousLogin]),
      user_id: userId,
      deleted_at: null,
    }, {
      last_login: currentLogin,
    })

    return user
  })
}
