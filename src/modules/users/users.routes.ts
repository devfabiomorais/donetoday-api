import { Router } from 'express'
import { getUsers, getUserById, postUser, putUser, removeUser } from './users.controller'

const router = Router()

router.get('/', getUsers)
router.get('/:id', getUserById)
router.post('/', postUser)
router.put('/:id', putUser)
router.delete('/:id', removeUser)

export default router