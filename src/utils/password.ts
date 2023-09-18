import bcrypt from 'bcryptjs'

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, await bcrypt.genSalt(10))
}

export const verifyPassword = async (
  password: string,
  hashedPassword: string,
) => {
  return bcrypt.compare(password, hashedPassword)
}
