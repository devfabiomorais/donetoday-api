import { env } from '../../lib/env'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'node:crypto'
import prisma from '../../lib/prisma'
import { sendPasswordResetEmail } from '../../lib/email'

export const register = async (name: string, email: string, password: string) => {
  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    throw new Error('Email already in use')
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
    select: { id: true, name: true, email: true, role: true, createdAt: true }
  })

  return user
}

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    throw new Error('Invalid credentials')
  }

  const passwordMatch = await bcrypt.compare(password, user.password)
  if (!passwordMatch) {
    throw new Error('Invalid credentials')
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    env.JWT_SECRET!,
    { expiresIn: '7d' }
  )

  return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } }
}

export const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return

  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60)

  await prisma.user.update({
    where: { email },
    data: { resetToken: token, resetTokenExpiresAt: expiresAt }
  })

  await sendPasswordResetEmail(email, token)
}

export const resetPassword = async (token: string, newPassword: string) => {
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiresAt: { gt: new Date() }
    }
  })

  if (!user) {
    throw new Error('Invalid or expired token')
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10)

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiresAt: null
    }
  })
}