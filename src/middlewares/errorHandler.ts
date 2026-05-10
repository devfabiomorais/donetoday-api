import { Request, Response, NextFunction } from 'express'

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error)

  const knownErrors: Record<string, number> = {
    'Invalid credentials': 401,
    'Email already in use': 409,
    'Invalid or expired token': 400,
  }

  const status = knownErrors[error.message] ?? 500
  const message = status !== 500 ? error.message : 'Internal server error'

  res.status(status).json({ message })
}