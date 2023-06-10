import { Prisma, PrismaClient } from '@prisma/client';
import { env } from '../../config/env.js';

export const prisma = new PrismaClient();

export function reportPrismaError(e: Error): void {
  let isPrismaError = false;

  if (e instanceof Prisma.PrismaClientInitializationError) {
    console.error(`Database initialization failed: ${e.message}`);
    isPrismaError = true;
  }

  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    const { name, code, message } = e;
    const meta = e.meta as { target?: string[] };

    console.error(
      `Database Error: name: ${name} | message: ${message} | code: ${code} | field: ${
        meta.target ? meta.target.join('|') : 'unknown field'
      }`
    );

    isPrismaError = true;
  }

  if (e instanceof Prisma.PrismaClientUnknownRequestError) {
    const { name, message } = e;

    console.error(`Database Error: name: ${name} | message: ${message} }`);
    isPrismaError = true;
  }

  if (e instanceof Prisma.PrismaClientValidationError) {
    const { name, message } = e;

    console.error(`Database Error: name: ${name} | message: ${message} }`);
    isPrismaError = true;
  }

  if (isPrismaError)
    throw new Error('An error has occurred. Please try again later');
}
