import prisma from '../../lib/prisma'
import { HistoryMode } from '../../generated/prisma/client'

// Busca as configurações do usuário, criando com valores padrão se não existirem
export const findOrCreateSettings = async (userId: string) => {
  return prisma.userSettings.upsert({
    where: { userId },
    update: {},
    create: {
      userId,
      historyMode: 'BY_EXERCISE',
      defaultRestSeconds: 60,
    },
  })
}

// Atualiza as configurações do usuário
export const updateSettings = async (userId: string, data: {
  historyMode?: HistoryMode
  defaultRestSeconds?: number
}) => {
  return prisma.userSettings.upsert({
    where: { userId },
    update: data,
    create: {
      userId,
      historyMode: data.historyMode ?? 'BY_EXERCISE',
      defaultRestSeconds: data.defaultRestSeconds ?? 60,
    },
  })
}