import { Router } from 'express'
import {
  getWorkouts,
  getWorkoutById,
  postStartWorkout,
  postSaveWorkout,
  removeWorkout,
  getLastSets,
} from './workouts.controller'
import { validate } from '../../middlewares/validate'
import { startWorkoutSchema, saveWorkoutSchema } from './schemas/workouts.schema'
import { authenticate } from '../../middlewares/authenticate'

const router = Router()

router.get('/', authenticate, getWorkouts)
router.get('/:id', authenticate, getWorkoutById)
router.post('/start', authenticate, validate(startWorkoutSchema), postStartWorkout)
router.post('/:id/save', authenticate, validate(saveWorkoutSchema), postSaveWorkout)
router.delete('/:id', authenticate, removeWorkout)
router.get('/history/:exerciseId', authenticate, getLastSets)

export default router