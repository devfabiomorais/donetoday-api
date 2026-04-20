import { Response, NextFunction } from 'express'
import { AuthRequest } from '../../middlewares/authenticate'
import { findAllUsers, findUserById, updateUser, deleteUser } from './admin.service'

export const getUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const users = await findAllUsers()
    res.json(users)
  } catch (error) {
    next(error)
  }
}

export const getUserById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string }
    const user = await findUserById(id)
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }
    res.json(user)
  } catch (error) {
    next(error)
  }
}

export const putUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string }
    const { name, email, role } = req.body
    const user = await updateUser(id, name, email, role)
    res.json(user)
  } catch (error) {
    next(error)
  }
}

export const removeUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string }
    await deleteUser(id)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}