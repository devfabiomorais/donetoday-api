import { z } from 'zod'

const workoutSetSchema = z.object({
  exerciseId: z.string().uuid('Invalid exercise ID'),
  setNumber: z.number().int().min(1),
  weight: z.number().positive().optional(),
  reps: z.number().int().min(0).optional(),
  duration: z.number().int().min(0).optional(),
  setType: z.enum(['NORMAL', 'WARMUP', 'FEEDER', 'DROPSET', 'FAILURE', 'CLUSTER_SET', 'POINT_ZERO', 'CONCENTRATION_PIKE']).default('NORMAL'),
  completed: z.boolean().default(false),
})

export const startWorkoutSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  routineId: z.string().uuid('Invalid routine ID').optional(),
})

export const saveWorkoutSchema = z.object({
  notes: z.string().optional(),
  sets: z.array(workoutSetSchema).min(1, 'At least one set is required'),
})

export const updateWorkoutSchema = z.object({
  notes: z.string().optional(),
})