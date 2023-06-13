import { env } from '../config/env.js';
import { reportPrismaError } from '../libs/prisma/index.js';

export async function wrapService<T extends (...args: any[]) => Promise<any>>(
  func: T,
  ...args: Parameters<T>
): Promise<ReturnType<T>> {
  try {
    return await func(...args);
  } catch (error) {
    if (env.NODE_ENV === 'development') console.error(error);

    reportPrismaError(error as Error);
    throw error;
  }
}
