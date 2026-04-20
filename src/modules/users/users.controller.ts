import { Response, NextFunction } from 'express'
import { AuthRequest } from '../../middlewares/authenticate'
import { findMe, updateMe, deleteMe } from './users.service'

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await findMe(req.userId!)
    res.json(user)
  } catch (error) {
    next(error)
  }
}

export const putMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, email } = req.body
    const user = await updateMe(req.userId!, name, email)
    res.json(user)
  } catch (error) {
    next(error)
  }
}

export const removeMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await deleteMe(req.userId!)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}