import { Response, NextFunction } from 'express'
import { AuthRequest } from '../../middlewares/authenticate'
import { findOrCreateSettings, updateSettings } from './user-settings.service'

// GET /user-settings → retorna as configurações do usuário autenticado
export const getSettings = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const settings = await findOrCreateSettings(req.userId!)
    res.json(settings)
  } catch (error) {
    next(error)
  }
}

// PUT /user-settings → atualiza as configurações do usuário autenticado
export const putSettings = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const settings = await updateSettings(req.userId!, req.body)
    res.json(settings)
  } catch (error) {
    next(error)
  }
}