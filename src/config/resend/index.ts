import { Resend } from 'resend'
import { env } from '../env/env.js'

export const resend = new Resend(env.RESEND_API_KEY)
