import { Resend } from 'resend'
import { env } from './env'

const resend = new Resend(env.RESEND_API_KEY)

export const sendPasswordResetEmail = async (to: string, token: string) => {
  const resetUrl = `${env.APP_URL}/reset-password?token=${token}`

  await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to,
    subject: 'Reset your password',
    html: `
  <h2>Reset your password</h2>
  <p>Click the link below to reset your password. This link expires in 1 hour.</p>
  <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background-color:#3366FF;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:bold;">Reset Password</a>
  <br/><br/>
  <p>Or copy and paste this link in your browser:</p>
  <p>${resetUrl}</p>
  <p>If you didn't request this, please ignore this email.</p>
`,
  })
}