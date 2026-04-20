import prisma from '../../lib/prisma'

export const findMe = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true }
  })
}

export const updateMe = async (id: string, name: string, email: string) => {
  return prisma.user.update({
    where: { id },
    data: { name, email },
    select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true }
  })
}

export const deleteMe = async (id: string) => {
  return prisma.user.delete({ where: { id } })
}