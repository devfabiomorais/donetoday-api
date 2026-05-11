import { z } from 'zod'

// Schema para um exercício dentro da rotina (ordenação e configuração de séries)
const routineSetConfigSchema = z.object({
  setNumber: z.number().int().min(1),
  setType: z.enum(['NORMAL', 'WARMUP', 'FEEDER', 'DROPSET', 'FAILURE', 'CLUSTER_SET', 'POINT_ZERO']).default('NORMAL'),
})

const routineExerciseSchema = z.object({
  exerciseId: z.string().uuid('Invalid exercise ID'),
  order: z.number().int().min(0, 'Order must be >= 0'),
  sets: z.number().int().min(1, 'Sets must be at least 1').default(3),
  restSeconds: z.number().int().min(0, 'Rest seconds must be >= 0').default(60),
  setsConfig: z.array(routineSetConfigSchema).optional(),
})

export const createRoutineSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  isPublic: z.boolean().default(false),
  exercises: z.array(routineExerciseSchema).min(1, 'At least one exercise is required'),
})

export const updateRoutineSchema = createRoutineSchema.partial()