import { Response, NextFunction } from 'express'
import { AuthRequest } from '../../middlewares/authenticate'
import {
  findWorkoutsByUser,
  findWorkoutById,
  startWorkout,
  saveWorkout,
  deleteWorkout,
  findLastSetsForExercise,
} from './workouts.service'

export const getWorkouts = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const workouts = await findWorkoutsByUser(req.userId!)
    res.json(workouts)
  } catch (error) {
    next(error)
  }
}

export const getWorkoutById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string }
    const workout = await findWorkoutById(id, req.userId!)
    if (!workout) {
      res.status(404).json({ message: 'Workout not found' })
      return
    }
    res.json(workout)
  } catch (error) {
    next(error)
  }
}

export const postStartWorkout = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const workout = await startWorkout(req.userId!, req.body)
    res.status(201).json(workout)
  } catch (error) {
    next(error)
  }
}

export const postSaveWorkout = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string }
    const workout = await findWorkoutById(id, req.userId!)
    if (!workout) {
      res.status(404).json({ message: 'Workout not found' })
      return
    }
    const saved = await saveWorkout(id, req.body)
    res.json(saved)
  } catch (error) {
    next(error)
  }
}

export const removeWorkout = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string }
    const workout = await findWorkoutById(id, req.userId!)
    if (!workout) {
      res.status(404).json({ message: 'Workout not found' })
      return
    }
    await deleteWorkout(id)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}

export const getLastSets = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { exerciseId } = req.params as { exerciseId: string }
    const { routineId } = req.query as { routineId?: string }
    const sets = await findLastSetsForExercise(req.userId!, exerciseId, routineId)
    res.json(sets)
  } catch (error) {
    next(error)
  }
}