import prisma from '../../lib/prisma'

export const findAllUsers = async () => {
  return prisma.user.findMany()
}