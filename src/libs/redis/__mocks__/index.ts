import { type Redis } from 'ioredis'
import { beforeEach } from 'vitest'
import { mockDeep, mockReset } from 'vitest-mock-extended'

beforeEach(() => mockReset(redis))

export const redis = mockDeep<Redis>()
