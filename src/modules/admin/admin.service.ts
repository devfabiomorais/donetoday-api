import prisma from '../../lib/prisma'

export const findAllUsers = async () => {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true }
  })
}

export const findUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true }
  })
}

export const updateUser = async (id: string, name: string, email: string, role: string) => {
  return prisma.user.update({
    where: { id },
    data: { name, email, role: role as 'USER' | 'ADMIN' },
    select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true }
  })
}

export const deleteUser = async (id: string) => {
  return prisma.user.delete({ where: { id } })
}