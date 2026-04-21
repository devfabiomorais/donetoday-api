import prisma from '../../lib/prisma'
import { Equipment, ExerciseType, MetricType, MuscleGroup } from '../../generated/prisma/client'

export const findAllExercises = async () => {
  return prisma.exercise.findMany({
    where: { isCustom: false },
    orderBy: { name: 'asc' }
  })
}

export const findExercisesByUser = async (userId: string) => {
  return prisma.exercise.findMany({
    where: { isCustom: true, createdBy: userId },
    orderBy: { name: 'asc' }
  })
}

export const findExerciseById = async (id: string) => {
  return prisma.exercise.findUnique({ where: { id } })
}

export const createExercise = async (userId: string, data: {
  name: string
  muscleGroups: MuscleGroup[]
  equipment?: Equipment[]
  exerciseTypes: ExerciseType[]
  metricType: MetricType
  imageUrl?: string
  videoUrl?: string
}) => {
  return prisma.exercise.create({
    data: { ...data, isCustom: true, createdBy: userId }
  })
}

export const updateExercise = async (id: string, data: {
  name?: string
  muscleGroups?: MuscleGroup[]
  equipment?: Equipment[]
  exerciseTypes?: ExerciseType[]
  metricType?: MetricType
  imageUrl?: string
  videoUrl?: string
}) => {
  return prisma.exercise.update({ where: { id }, data })
}

export const deleteExercise = async (id: string) => {
  return prisma.exercise.delete({ where: { id } })
}