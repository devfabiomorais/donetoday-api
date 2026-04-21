import { Router } from 'express'
import { getExercises, getMyExercises, getExerciseById, postExercise, putExercise, removeExercise } from './exercises.controller'
import { validate } from '../../middlewares/validate'
import { createExerciseSchema, updateExerciseSchema } from './schemas/exercises.schema'
import { authenticate } from '../../middlewares/authenticate'

const router = Router()

router.get('/', authenticate, getExercises)
router.get('/me', authenticate, getMyExercises)
router.get('/:id', authenticate, getExerciseById)
router.post('/', authenticate, validate(createExerciseSchema), postExercise)
router.put('/:id', authenticate, validate(updateExerciseSchema), putExercise)
router.delete('/:id', authenticate, removeExercise)

export default router