import { Router } from 'express'
import { getUsers, getUserById, postUser, putUser, removeUser } from './users.controller'
import { validate } from '../../middlewares/validate'
import { createUserSchema, updateUserSchema } from './schemas/user.schema'

const router = Router()

router.get('/', getUsers)
router.get('/:id', getUserById)
router.post('/', validate(createUserSchema), postUser)
router.put('/:id', validate(updateUserSchema), putUser)
router.delete('/:id', removeUser)

export default router