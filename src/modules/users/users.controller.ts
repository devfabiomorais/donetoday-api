import { Request, Response, NextFunction } from 'express'
import { findAllUsers, findUserById, createUser, updateUser, deleteUser } from './users.service'

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await findAllUsers()
    res.json(users)
  } catch (error) {
    next(error)
  }
}

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
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

export const postUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email } = req.body
    const user = await createUser(name, email)
    res.status(201).json(user)
  } catch (error) {
    next(error)
  }
}

export const putUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string }
    const { name, email } = req.body
    const user = await updateUser(id, name, email)
    res.json(user)
  } catch (error) {
    next(error)
  }
}

export const removeUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string }
    await deleteUser(id)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}