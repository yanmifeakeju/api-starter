import { Redis } from 'ioredis'
import { env } from '../../config/env/env.js'

export const redis = new Redis(env.REDIS_URL)
