import { Resend } from 'resend'
import { env } from '../../config/env.js'

const resend = new Resend(env.RESEND_API_KEY)

console.log(
  await resend.emails.send({
    from: 'onboarding@yanmifeakeju.link',
    to: 'yanmifeakeju@gmail.com',
    subject: 'Hello World',
    html: '<p>Congrats on sending your <strong>first email</strong>!</p>',
  }),
)
