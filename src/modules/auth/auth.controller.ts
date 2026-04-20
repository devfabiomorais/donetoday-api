import { Request, Response, NextFunction } from 'express'
import { register, login, forgotPassword, resetPassword } from './auth.service'

export const registerController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body
    const user = await register(name, email, password)
    res.status(201).json(user)
  } catch (error) {
    next(error)
  }
}

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body
    const data = await login(email, password)
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export const forgotPasswordController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body
    await forgotPassword(email)
    res.json({ message: 'If this email exists, a reset link has been sent' })
  } catch (error) {
    next(error)
  }
}

export const resetPasswordController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, password } = req.body
    await resetPassword(token, password)
    res.json({ message: 'Password reset successfully' })
  } catch (error) {
    next(error)
  }
}