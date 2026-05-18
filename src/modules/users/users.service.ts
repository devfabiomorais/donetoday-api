import prisma from '../../lib/prisma'

export const findMe = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true, avatarUrl: true, createdAt: true, updatedAt: true }
  })
}

export const updateMe = async (id: string, data: { name?: string; email?: string; avatarUrl?: string }) => {
  return prisma.user.update({
    where: { id },
    data,
    select: { id: true, name: true, email: true, role: true, avatarUrl: true, createdAt: true, updatedAt: true }
  })
}

export const deleteMe = async (id: string) => {
  return prisma.user.delete({ where: { id } })
}

export const findProfile = async (userId: string) => {
  return prisma.userProfile.findUnique({ where: { userId } })
}

export const upsertProfile = async (userId: string, data: {
  bio?: string
  birthDate?: string
  weight?: number
  height?: number
  waist?: number
  hip?: number
  biceps?: number
  thigh?: number
  chest?: number
}) => {
  const { birthDate, ...rest } = data
  return prisma.userProfile.upsert({
    where: { userId },
    update: { ...rest, birthDate: birthDate ? new Date(birthDate) : undefined },
    create: { userId, ...rest, birthDate: birthDate ? new Date(birthDate) : undefined },
  })
}