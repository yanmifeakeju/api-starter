import { and, eq, isNull, or, sql } from 'drizzle-orm';
import { type OnlyOneProperty } from '../../../@types/util-types/index.js';
import { type ISaveUserEntity, users, usersCredentials } from '../../../db/schema/index.js';
import { db } from '../../../libs/drizzle/index.js';
import { type UserProfile } from './types.js';

type SanitizedUserProps = Pick<typeof users, 'email' | 'username' | 'userId' | 'lastLogin'>;

const sanitizedUserFields: SanitizedUserProps = {
  email: users.email,
  lastLogin: users.lastLogin,
  userId: users.userId,
  username: users.username,
};

export const saveUser = async ({
  email,
  username,
  password,
}: ISaveUserEntity & { password: string }): Promise<UserProfile> => {
  return await db.transaction(async (trx) => {
    const [record] = await trx
      .insert(users)
      .values({ email, username })
      .returning({ ...sanitizedUserFields, recordId: users.id });

    const { recordId, ...user } = record;

    await trx.insert(usersCredentials).values({ userId: recordId, password });

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
    .select(sanitizedUserFields)
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
    .select(sanitizedUserFields)
    .from(users)
    .where(filter[0]);

  return user.length ? user[0] : null;
};

export const fetchUserByIdPrepared = () => {
  const prepared = db
    .select(sanitizedUserFields)
    .from(users)
    .where(eq(users.userId, sql.placeholder('userId')))
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
      user: sanitizedUserFields,
      cred: {
        password: usersCredentials.password,
      },
    })
    .from(users)
    .innerJoin(usersCredentials, eq(users.id, usersCredentials.userId))
    .where(and(eq(users.email, sql.placeholder('email')), isNull(users.deletedAt)))
    .prepare('fetch_auth_creds');
  return async (email: string) => {
    const userWithCreds = await prepared.execute({ email });
    return userWithCreds.length ? userWithCreds[0] : null;
  };
};

export const fetchUserAuthCredentials = fetchUserAuthCredentialsPrepared();

export const updateLastLogin = async (
  userId: string,
  { newLogin, previousLogin }: { previousLogin: Date; newLogin: Date },
) => {
  const [user] = await db.transaction(async (tx) => {
    return await tx.update(users).set({ lastLogin: newLogin }).where(
      and(
        eq(users.userId, userId),
        sql`${previousLogin} <= ${users.lastLogin}`,
      ),
    ).returning({ lastLogin: users.lastLogin });
  });

  return user;
};
