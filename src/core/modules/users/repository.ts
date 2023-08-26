import { and, eq, isNull, or, placeholder } from 'drizzle-orm';
import { type ISaveUserEntity, users, usersCredentials } from '../../../db/schema/index.js';
import { db } from '../../../libs/drizzle/index.js';
import { type OnlyOneProperty } from '../../../types/util-types/index.js';
import { type User, type UserProfile } from './types.js';

export const saveUser = async ({
  email,
  username,
  password,
}: ISaveUserEntity & { password: string }): Promise<UserProfile> => {
  return await db.transaction(async (trx) => {
    const [user] = await trx
      .insert(users)
      .values({ email, username })
      .returning();

    await trx.insert(usersCredentials).values({ userId: user.id, password });
    return user;
  });
};

export const fetchUser = async ({
  email,
  username,
}: Partial<Omit<UserProfile, 'lastLogin' | 'userId'>>) => {
  const filter = [];

  email && filter.push(eq(users.email, email));
  username && filter.push(eq(users.username, username));

  const user = await db
    .select()
    .from(users)
    .where(or(...filter));

  return user.length ? user[0] : null;
};

export const fetchUniqueUser = async ({
  email,
  userId,
  username,
}: OnlyOneProperty<Omit<UserProfile, 'lastLogin'>>) => {
  const filter = [];

  email && filter.push(eq(users.email, email));
  userId && filter.push(eq(users.userId, userId));
  username && filter.push(eq(users.username, username));

  if (filter.length === 0) throw new Error('Missing filters.');

  const user = await db
    .select()
    .from(users)
    .where(filter[0]);

  return user.length ? user[0] : null;
};

export const fetchUserByIdPrepared = () => {
  const prepared = db
    .select()
    .from(users)
    .where(eq(users.userId, placeholder('userId')))
    .prepare('fetch_user_id');
  return async (userId: string) => {
    const user = await prepared.execute({ userId });
    return user.length ? user[0] : null;
  };
};

export const fetchUserById = fetchUserByIdPrepared();

const fetchUserAuthCredentialsPrepared = () => {
  const prepared = db
    .select({
      user: users,
      cred: {
        password: usersCredentials.password,
      },
    })
    .from(users)
    .innerJoin(usersCredentials, eq(users.id, usersCredentials.userId))
    .where(and(eq(users.email, placeholder('email')), isNull(users.deletedAt)))
    .prepare('fetch_auth_creds');
  return async (email: string) => {
    const userWithCreds = await prepared.execute({ email });
    return userWithCreds.length ? userWithCreds[0] : null;
  };
};

export const fetchUserAuthCredentials = fetchUserAuthCredentialsPrepared();

export const updateUserById = async (userId: string, data: Pick<User, 'lastLogin'>) => {
  return await db.transaction(async (tx) => {
    return await tx.update(users).set({ ...data }).where(
      and(eq(users.userId, userId)),
    ).returning();
  });
};
