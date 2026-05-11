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
    include: {
      exercise: true,
      setsConfig: { orderBy: { setNumber: 'asc' } },
    },
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
    include: {
      exercise: true,
      setsConfig: { orderBy: { setNumber: 'asc' } },
    },
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
    include: {
      exercise: true,
      setsConfig: { orderBy: { setNumber: 'asc' } },
    },
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
// export const createRoutine = async (
//   userId: string,
//   data: {
//     name: string
//     description?: string
//     isPublic?: boolean
//     exercises: Array<{
//       exerciseId: string
//       order: number
//       sets: number
//       restSeconds: number
//       setsConfig?: Array<{
//         setNumber: number
//         setType: string
//       }>
//     }>
//   }
// ) => {
//   const { exercises, ...routineData } = data

//   return prisma.$transaction(async (tx: any) => {
//     const routine = await tx.routine.create({
//       data: { ...routineData, userId },
//     })

//     for (const ex of exercises) {
//       const routineExercise = await tx.routineExercise.create({
//         data: {
//           routineId: routine.id,
//           exerciseId: ex.exerciseId,
//           order: ex.order,
//           sets: ex.sets,
//           restSeconds: ex.restSeconds,
//         },
//       })

//       if (ex.setsConfig && ex.setsConfig.length > 0) {
//         await tx.routineSetConfig.createMany({
//           data: ex.setsConfig.map((sc) => ({
//             routineExerciseId: routineExercise.id,
//             setNumber: sc.setNumber,
//             setType: sc.setType as any,
//           })),
//         })
//       }
//     }

//     return tx.routine.findUnique({
//       where: { id: routine.id },
//       include: {
//         exercises: {
//           include: {
//             exercise: true,
//             setsConfig: { orderBy: { setNumber: 'asc' } },
//           },
//           orderBy: { order: 'asc' },
//         },
//       },
//     })
//   })
// }

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
      setsConfig?: Array<{
        setNumber: number
        setType: string
      }>
    }>
  }
) => {
  const { exercises, ...routineData } = data

  return prisma.$transaction(async (tx: any) => {
    const routine = await tx.routine.create({
      data: { ...routineData, userId },
    })

    for (const ex of exercises) {
      const routineExercise = await tx.routineExercise.create({
        data: {
          routineId: routine.id,
          exerciseId: ex.exerciseId,
          order: ex.order,
          sets: ex.sets,
          restSeconds: ex.restSeconds,
        },
      })

      if (ex.setsConfig && ex.setsConfig.length > 0) {
        await tx.routineSetConfig.createMany({
          data: ex.setsConfig.map((sc) => ({
            routineExerciseId: routineExercise.id,
            setNumber: sc.setNumber,
            setType: sc.setType as any,
          })),
        })
      }
    }

    return tx.routine.findUnique({
      where: { id: routine.id },
      include: {
        exercises: {
          include: {
            exercise: true,
            setsConfig: { orderBy: { setNumber: 'asc' } },
          },
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
      setsConfig?: Array<{
        setNumber: number
        setType: string
      }>
    }>
  }
) => {
  const { exercises, ...routineData } = data

  return prisma.$transaction(async (tx: any) => {
    const routine = await tx.routine.update({
      where: { id },
      data: routineData,
    })

    if (exercises) {
      await tx.routineExercise.deleteMany({ where: { routineId: id } })

      for (const ex of exercises) {
        const routineExercise = await tx.routineExercise.create({
          data: {
            routineId: id,
            exerciseId: ex.exerciseId,
            order: ex.order,
            sets: ex.sets,
            restSeconds: ex.restSeconds,
          },
        })

        if (ex.setsConfig && ex.setsConfig.length > 0) {
          await tx.routineSetConfig.createMany({
            data: ex.setsConfig.map((sc) => ({
              routineExerciseId: routineExercise.id,
              setNumber: sc.setNumber,
              setType: sc.setType as any,
            })),
          })
        }
      }
    }

    return tx.routine.findUnique({
      where: { id },
      include: {
        exercises: {
          include: {
            exercise: true,
            setsConfig: { orderBy: { setNumber: 'asc' } },
          },
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