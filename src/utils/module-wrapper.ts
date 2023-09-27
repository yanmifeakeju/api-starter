import { handleAppError } from './errors.js'

// Wrapper for the core modules
// I want to know every error that happens inside the code.
// Technically, it is something serious that needs to be checked out.
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
