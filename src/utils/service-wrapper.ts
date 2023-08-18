import { handleAppError } from './errors.js';

export function moduleAsyncWrapper(label: string) {
  return function wrapper<T>(asyncFunction: (...args: any[]) => Promise<T>) {
    return async (...args: any[]): Promise<T> => {
      try {
        return await asyncFunction(...args);
      } catch (error) {
        return handleAppError(label, error as Error);
      }
    };
  };
}
