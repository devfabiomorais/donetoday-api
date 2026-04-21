import prisma from '../../lib/prisma'
import { SetType } from '../../generated/prisma/client'

export const findWorkoutsByUser = async (userId: string) => {
  return prisma.workout.findMany({
    where: { userId },
    include: {
      routine: { select: { id: true, name: true } },
      sets: {
        include: { exercise: true },
        orderBy: [{ exerciseId: 'asc' }, { setNumber: 'asc' }],
      },
    },
    orderBy: { startedAt: 'desc' },
  })
}

export const findWorkoutById = async (id: string, userId: string) => {
  const workout = await prisma.workout.findUnique({
    where: { id },
    include: {
      routine: { select: { id: true, name: true } },
      sets: {
        include: { exercise: true },
        orderBy: [{ exerciseId: 'asc' }, { setNumber: 'asc' }],
      },
    },
  })
  if (!workout || workout.userId !== userId) return null
  return workout
}

export const startWorkout = async (userId: string, data: {
  name: string
  routineId?: string
}) => {
  return prisma.workout.create({
    data: { ...data, userId },
    include: {
      routine: { select: { id: true, name: true } },
      sets: true,
    },
  })
}

export const saveWorkout = async (id: string, data: {
  notes?: string
  sets: Array<{
    exerciseId: string
    setNumber: number
    weight?: number
    reps?: number
    duration?: number
    setType: SetType
    completed: boolean
  }>
}) => {
  const { sets, notes } = data

  return prisma.$transaction(async (tx) => {
    await tx.workoutSet.deleteMany({ where: { workoutId: id } })

    await tx.workoutSet.createMany({
      data: sets.map((set) => ({
        ...set,
        workoutId: id,
      })),
    })

    return tx.workout.update({
      where: { id },
      data: {
        notes,
        finishedAt: new Date(),
      },
      include: {
        routine: { select: { id: true, name: true } },
        sets: {
          include: { exercise: true },
          orderBy: [{ exerciseId: 'asc' }, { setNumber: 'asc' }],
        },
      },
    })
  })
}

export const deleteWorkout = async (id: string) => {
  return prisma.workout.delete({ where: { id } })
}

export const findLastSetsForExercise = async (userId: string, exerciseId: string, routineId?: string) => {
  const lastWorkout = await prisma.workout.findFirst({
    where: {
      userId,
      finishedAt: { not: null },
      ...(routineId ? { routineId } : {}),
      sets: { some: { exerciseId } },
    },
    orderBy: { finishedAt: 'desc' },
    include: {
      sets: {
        where: { exerciseId },
        orderBy: { setNumber: 'asc' },
      },
    },
  })
  return lastWorkout?.sets ?? []
}