import { Router } from 'express'
import { getSettings, putSettings } from './user-settings.controller'
import { validate } from '../../middlewares/validate'
import { updateUserSettingsSchema } from './schemas/user-settings.schema'
import { authenticate } from '../../middlewares/authenticate'

const router = Router()

router.get('/', authenticate, getSettings)
router.put('/', authenticate, validate(updateUserSettingsSchema), putSettings)

export default router