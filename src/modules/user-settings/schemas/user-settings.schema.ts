import { z } from 'zod'

export const updateUserSettingsSchema = z.object({
  historyMode: z.enum(['BY_EXERCISE', 'BY_ROUTINE']).optional(),
  defaultRestSeconds: z.number().int().min(0).max(600).optional(),
})