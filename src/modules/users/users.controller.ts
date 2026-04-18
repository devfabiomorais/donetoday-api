import { Request, Response } from 'express'
import { findAllUsers } from './users.service'

export const getUsers = async (req: Request, res: Response) => {
  const users = await findAllUsers()
  res.json(users)
}