import { eq, or, placeholder } from 'drizzle-orm';
import { users, usersCredentials } from '../../../../db/schema/index.js';
import { db } from '../../../../libs/drizzle/index.js';
import { type OnlyOneProperty } from '../../../../types/util-types/index.js';
import { type UserProfile } from '../schema.js';

export const saveUser = async ({
  email,
  username,
  password,
}: Pick<
  UserProfile & { password: string },
  'email' | 'username' | 'password'
>): Promise<UserProfile> => {
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

  const user = await db
    .select()
    .from(users)
    .where(or(...filter));

  return user.length ? user[0] : null;
};

export const fetchUserByIdPrepared = () => {
  const prepared = db
    .select()
    .from(users)
    .where(eq(users.userId, placeholder('userId')))
    .prepare('fetch_user_id');
  return async (userId: string) => {
    const password = await prepared.execute({ userId });
    return password.length ? password[0] : null;
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
    .where(eq(users.email, placeholder('email')))
    .prepare('fetch_auth_creds');
  return async (email: string) => {
    const userWithCreds = await prepared.execute({ email });
    return userWithCreds.length ? userWithCreds[0] : null;
  };
};
export const fetchUserAuthCredentials = fetchUserAuthCredentialsPrepared();
