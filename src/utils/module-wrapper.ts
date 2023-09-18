import { handleAppError } from './errors.js'

export function moduleAsyncWrapper(label: string) {
  return function wrapper<T extends (...args: Parameters<T>) => ReturnType<T>>(
    asyncFunction: T,
  ) {
    return async (...args: Parameters<T>) => {
      try {
        return await Promise.resolve(asyncFunction(...args))
      } catch (error) {
        return handleAppError(label, error as Error)
      }
    }
  }
}
