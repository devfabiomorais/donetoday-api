import { Router } from 'express'
import { getMe, putMe, removeMe, getProfile, putProfile } from './users.controller'
import { validate } from '../../middlewares/validate'
import { updateUserSchema } from './schemas/user.schema'
import { authenticate } from '../../middlewares/authenticate'

const router = Router()

router.get('/me', authenticate, getMe)
router.put('/me', authenticate, validate(updateUserSchema), putMe)
router.delete('/me', authenticate, removeMe)
router.get('/me/profile', authenticate, getProfile)
router.put('/me/profile', authenticate, putProfile)

export default router