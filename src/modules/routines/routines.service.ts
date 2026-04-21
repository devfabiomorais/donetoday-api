import prisma from '../../lib/prisma'

// Lista todas as rotinas públicas (para descoberta) e as rotinas do próprio usuário
export const findAccessibleRoutines = async (userId: string) => {
  return prisma.routine.findMany({
    where: {
      OR: [
        { isPublic: true },
        { userId },
      ],
    },
    include: {
      exercises: {
        include: { exercise: true },
        orderBy: { order: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

// Lista apenas as rotinas criadas pelo usuário
export const findRoutinesByUser = async (userId: string) => {
  return prisma.routine.findMany({
    where: { userId },
    include: {
      exercises: {
        include: { exercise: true },
        orderBy: { order: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

// Busca uma rotina por ID, garantindo que o usuário tenha acesso (própria ou pública)
export const findRoutineById = async (id: string, userId?: string) => {
  const routine = await prisma.routine.findUnique({
    where: { id },
    include: {
      exercises: {
        include: { exercise: true },
        orderBy: { order: 'asc' },
      },
    },
  })

  if (!routine) return null
  // Se a rotina não for pública e não pertencer ao usuário, retorna null (acesso negado)
  if (!routine.isPublic && routine.userId !== userId) return null
  return routine
}

// Cria uma nova rotina com seus exercícios (transação)
export const createRoutine = async (
  userId: string,
  data: {
    name: string
    description?: string
    isPublic?: boolean
    exercises: Array<{
      exerciseId: string
      order: number
      sets: number
      restSeconds: number
    }>
  }
) => {
  const { exercises, ...routineData } = data

  return prisma.$transaction(async (tx) => {
    const routine = await tx.routine.create({
      data: {
        ...routineData,
        userId,
      },
    })

    await tx.routineExercise.createMany({
      data: exercises.map((ex) => ({
        routineId: routine.id,
        exerciseId: ex.exerciseId,
        order: ex.order,
        sets: ex.sets,
        restSeconds: ex.restSeconds,
      })),
    })

    return tx.routine.findUnique({
      where: { id: routine.id },
      include: {
        exercises: {
          include: { exercise: true },
          orderBy: { order: 'asc' },
        },
      },
    })
  })
}

// Atualiza uma rotina (substitui a lista de exercícios)
export const updateRoutine = async (
  id: string,
  data: {
    name?: string
    description?: string
    isPublic?: boolean
    exercises?: Array<{
      exerciseId: string
      order: number
      sets: number
      restSeconds: number
    }>
  }
) => {
  const { exercises, ...routineData } = data

  return prisma.$transaction(async (tx) => {
    // Atualiza os dados básicos da rotina
    const routine = await tx.routine.update({
      where: { id },
      data: routineData,
    })

    // Se houver nova lista de exercícios, substitui
    if (exercises) {
      // Remove os exercícios antigos
      await tx.routineExercise.deleteMany({ where: { routineId: id } })
      // Cria os novos
      await tx.routineExercise.createMany({
        data: exercises.map((ex) => ({
          routineId: id,
          exerciseId: ex.exerciseId,
          order: ex.order,
          sets: ex.sets,
          restSeconds: ex.restSeconds,
        })),
      })
    }

    return tx.routine.findUnique({
      where: { id },
      include: {
        exercises: {
          include: { exercise: true },
          orderBy: { order: 'asc' },
        },
      },
    })
  })
}

// Deleta uma rotina (cascateia para RoutineExercise automaticamente pelo schema)
export const deleteRoutine = async (id: string) => {
  return prisma.routine.delete({ where: { id } })
}