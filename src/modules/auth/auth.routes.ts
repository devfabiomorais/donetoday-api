import { Router } from 'express'
import { registerController, loginController, forgotPasswordController, resetPasswordController } from './auth.controller'
import { validate } from '../../middlewares/validate'
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from './schemas/auth.schema'

const router = Router()

router.post('/register', validate(registerSchema), registerController)
router.post('/login', validate(loginSchema), loginController)
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPasswordController)
router.post('/reset-password', validate(resetPasswordSchema), resetPasswordController)

export default router