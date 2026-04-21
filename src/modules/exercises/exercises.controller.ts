import { Response, NextFunction } from 'express'
import { AuthRequest } from '../../middlewares/authenticate'
import { findAllExercises, findExercisesByUser, findExerciseById, createExercise, updateExercise, deleteExercise } from './exercises.service'

export const getExercises = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const exercises = await findAllExercises()
    res.json(exercises)
  } catch (error) {
    next(error)
  }
}

export const getMyExercises = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const exercises = await findExercisesByUser(req.userId!)
    res.json(exercises)
  } catch (error) {
    next(error)
  }
}

export const getExerciseById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string }
    const exercise = await findExerciseById(id)
    if (!exercise) {
      res.status(404).json({ message: 'Exercise not found' })
      return
    }
    res.json(exercise)
  } catch (error) {
    next(error)
  }
}

export const postExercise = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const exercise = await createExercise(req.userId!, req.body)
    res.status(201).json(exercise)
  } catch (error) {
    next(error)
  }
}

export const putExercise = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string }
    const exercise = await findExerciseById(id)
    if (!exercise) {
      res.status(404).json({ message: 'Exercise not found' })
      return
    }
    if (exercise.createdBy !== req.userId) {
      res.status(403).json({ message: 'Access denied' })
      return
    }
    const updated = await updateExercise(id, req.body)
    res.json(updated)
  } catch (error) {
    next(error)
  }
}

export const removeExercise = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string }
    const exercise = await findExerciseById(id)
    if (!exercise) {
      res.status(404).json({ message: 'Exercise not found' })
      return
    }
    if (exercise.createdBy !== req.userId) {
      res.status(403).json({ message: 'Access denied' })
      return
    }
    await deleteExercise(id)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}