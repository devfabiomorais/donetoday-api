import { Router } from 'express'
import { getUsers, getUserById, putUser, removeUser } from './admin.controller'
import { authenticate } from '../../middlewares/authenticate'
import { authorize } from '../../middlewares/authorize'

const router = Router()

router.get('/users', authenticate, authorize('ADMIN'), getUsers)
router.get('/users/:id', authenticate, authorize('ADMIN'), getUserById)
router.put('/users/:id', authenticate, authorize('ADMIN'), putUser)
router.delete('/users/:id', authenticate, authorize('ADMIN'), removeUser)

export default router