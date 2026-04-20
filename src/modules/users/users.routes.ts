import { Router } from 'express'
import { getMe, putMe, removeMe } from './users.controller'
import { validate } from '../../middlewares/validate'
import { updateUserSchema } from './schemas/user.schema'
import { authenticate } from '../../middlewares/authenticate'

const router = Router()

router.get('/me', authenticate, getMe)
router.put('/me', authenticate, validate(updateUserSchema), putMe)
router.delete('/me', authenticate, removeMe)

export default router