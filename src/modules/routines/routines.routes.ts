import { Router } from 'express'
import {
  getRoutines,
  getMyRoutines,
  getRoutineById,
  postRoutine,
  putRoutine,
  removeRoutine,
} from './routines.controller'
import { validate } from '../../middlewares/validate'
import { createRoutineSchema, updateRoutineSchema } from './schemas/routines.schema'
import { authenticate } from '../../middlewares/authenticate'

const router = Router()

router.get('/', authenticate, getRoutines)
router.get('/me', authenticate, getMyRoutines)
router.get('/:id', authenticate, getRoutineById)
router.post('/', authenticate, validate(createRoutineSchema), postRoutine)
router.put('/:id', authenticate, validate(updateRoutineSchema), putRoutine)
router.delete('/:id', authenticate, removeRoutine)

export default router