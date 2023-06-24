import { Prisma, PrismaClient } from '@prisma/client';
import { env } from '../../config/env.js';
import { AppError } from '../../shared/error/AppError.js';

export const prisma = new PrismaClient();
