import { Response, NextFunction } from 'express'
import { AuthRequest } from './authenticate'

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.userRole!)) {
      res.status(403).json({ message: 'Access denied' })
      return
    }
    next()
  }
}