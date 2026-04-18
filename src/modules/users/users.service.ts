import prisma from '../../lib/prisma'

export const findAllUsers = async () => {
  return prisma.user.findMany()
}

export const findUserById = async (id: string) => {
  return prisma.user.findUnique({ where: { id } })
}

export const createUser = async (name: string, email: string) => {
  return prisma.user.create({ data: { name, email } })
}

export const updateUser = async (id: string, name: string, email: string) => {
  return prisma.user.update({ where: { id }, data: { name, email } })
}

export const deleteUser = async (id: string) => {
  return prisma.user.delete({ where: { id } })
}