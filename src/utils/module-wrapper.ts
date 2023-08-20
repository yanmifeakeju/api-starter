import { handleAppError } from './errors.js';

// export function moduleAsyncWrapper<T extends (...args: any[]) => Promise<any>>(
//   label: string
// ) {
//   return function wrapper(asyncFunction: T) {
//     return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
//       try {
//         return await asyncFunction(...args);
//       } catch (error) {
//         return handleAppError(label, error as Error);
//       }
//     };
//   };
// }

export function moduleAsyncWrapper(label: string) {
  return function wrapper<T extends (...args: Parameters<T>) => ReturnType<T>>(
    asyncFunction: T,
  ) {
    return async (...args: Parameters<T>) => {
      try {
        return asyncFunction(...args);
      } catch (error) {
        return handleAppError(label, error as Error);
      }
    };
  };
}
