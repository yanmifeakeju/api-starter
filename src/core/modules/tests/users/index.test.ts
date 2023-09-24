import Chance from 'chance'
import { beforeEach, describe, it, vi } from 'vitest'
import { create } from '../../users/index.js'

const chance = new Chance()

describe(`${create.name}`, () => {
  beforeEach(async () => {
    vi.resetAllMocks()
  })

  it('creates a user with valid payload and sanitizes password', async ({ expect }) => {
    // Arrange: Generate valid user payload
    const payload = {
      username: chance.twitter().replace('@', ''),
      email: chance.email(),
      phone: chance.phone({ country: 'uk', mobile: true, formatted: false }),
      password: 'hellopassword',
    }

    // Act: Create a new user
    const newUser = await create(payload)

    // Assert: Check expectations

    expect(newUser.userId).toBeDefined()
    expect(newUser.email).toBe(payload.email)
    expect(newUser.phone).toBe(payload.phone)
    expect(newUser).not.toHaveProperty('password')
  })

  it('throws for duplicate email entries in unique fields', async ({ expect }) => {
    expect.hasAssertions()

    // Arrange: Generate valid user payload
    const payload = {
      username: chance.twitter().replace('@', ''),
      email: chance.email(),
      phone: chance.phone({ country: 'uk', mobile: true, formatted: false }),
      password: chance.word({ length: 12 }),
    }

    // Act and Assert: Create two users with the same payload, expect an error
    try {
      Promise.all([
        await create(payload),
        await create(payload),
      ])
    } catch (error) {
      const err = error as Error
      expect(err.message).toEqual(expect.stringMatching(/(?=.*duplicate)(?=.*unique)/i))
    }
  })
})
