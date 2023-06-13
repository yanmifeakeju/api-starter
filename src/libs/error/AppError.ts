const appErrorType = {
  INVALID_ARGUMENT: 'INVALID_ARGUMENT',
  ILLEGAL_ARGUMENT: 'ILLEGAL_ARGUMENT',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  FATAL: 'FATAL'
} as const;

type AppErrorType = (typeof appErrorType)[keyof typeof appErrorType];

export class AppError extends Error {
  constructor(public errorType: AppErrorType, public message: string) {
    super(message);

    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this);
  }
}
