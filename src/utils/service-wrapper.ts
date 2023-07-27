import { env } from '../config/env.js';
import { handleAppError } from './errors.js';
import { reportPrismaError } from './prisma-error.js';

export function serviceAsyncWrapper<T>(
  asyncFunction: (...args: any[]) => Promise<T>
) {
  return async (...args: any[]): Promise<T> => {
    try {
      return await asyncFunction(...args);
    } catch (error) {
      return handleAppError(error as Error);
    }
  };
}
