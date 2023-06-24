import { env } from '../config/env.js';
import { AppError } from '../shared/error/AppError.js';
import { reportPrismaError } from './prismaError.js';

const convertAppErrorTypeToApiStatusCode = (value: AppError['errorType']) => {
  switch (value) {
    case 'DUPLICATE_ENTRY':
      return 409;
    case 'ILLEGAL_ARGUMENT':
      return 422;
    case 'INVALID_ARGUMENT':
      return 400;
    case 'FORBIDDEN':
      return 403;
    case 'NOT_FOUND':
      return 404;
    case 'TOO_MANY_REQUESTS':
      return 429;
    case 'FATAL':
    case 'DATABASE_ERROR':
      return 500;

    default:
      throw new Error(`Invalid error type ${value}`);
  }
};

export const mapAppErrorToApiError = (error: AppError) => {
  return {
    statusCode: convertAppErrorTypeToApiStatusCode(error.errorType),
    message: error.message
  };
};

export const handleAppError = (error: Error) => {
  if (env.NODE_ENV === 'development') console.error(error);
  reportPrismaError(error as Error);
  throw error;
};
