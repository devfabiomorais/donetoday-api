import { Request, Response } from 'express'
import { findAllUsers, findUserById, createUser, updateUser, deleteUser } from './users.service'

export const getUsers = async (req: Request, res: Response) => {
  const users = await findAllUsers()
  res.json(users)
}

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string }
  const user = await findUserById(id)
  if (!user) {
    res.status(404).json({ message: 'User not found' })
    return
  }
  res.json(user)
}

export const postUser = async (req: Request, res: Response) => {
  const { name, email } = req.body
  const user = await createUser(name, email)
  res.status(201).json(user)
}

export const putUser = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string }
  const { name, email } = req.body
  const user = await updateUser(id, name, email)
  res.json(user)
}

export const removeUser = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string }
  await deleteUser(id)
  res.status(204).send()
}