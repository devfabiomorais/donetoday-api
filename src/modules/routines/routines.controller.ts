import { Response, NextFunction } from 'express'
import { AuthRequest } from '../../middlewares/authenticate'
import {
  findAccessibleRoutines,
  findRoutinesByUser,
  findRoutineById,
  createRoutine,
  updateRoutine,
  deleteRoutine,
} from './routines.service'

// GET /routines – retorna rotinas públicas + as do usuário autenticado
export const getRoutines = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const routines = await findAccessibleRoutines(req.userId!)
    res.json(routines)
  } catch (error) {
    next(error)
  }
}

// GET /routines/me – retorna apenas as rotinas do usuário
export const getMyRoutines = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const routines = await findRoutinesByUser(req.userId!)
    res.json(routines)
  } catch (error) {
    next(error)
  }
}

// GET /routines/:id – retorna uma rotina específica (com verificação de acesso)
export const getRoutineById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string }
    const routine = await findRoutineById(id, req.userId!)
    if (!routine) {
      res.status(404).json({ message: 'Routine not found or access denied' })
      return
    }
    res.json(routine)
  } catch (error) {
    next(error)
  }
}

// POST /routines – cria uma nova rotina
export const postRoutine = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const routine = await createRoutine(req.userId!, req.body)
    res.status(201).json(routine)
  } catch (error) {
    next(error)
  }
}

// PUT /routines/:id – atualiza uma rotina existente (apenas dono)
export const putRoutine = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string }
    // Verifica se a rotina existe e se o usuário é dono
    const existing = await findRoutineById(id, req.userId!)
    if (!existing) {
      res.status(404).json({ message: 'Routine not found' })
      return
    }
    if (existing.userId !== req.userId) {
      res.status(403).json({ message: 'Access denied' })
      return
    }

    const updated = await updateRoutine(id, req.body)
    res.json(updated)
  } catch (error) {
    next(error)
  }
}

// DELETE /routines/:id – remove uma rotina (apenas dono)
export const removeRoutine = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string }
    const existing = await findRoutineById(id, req.userId!)
    if (!existing) {
      res.status(404).json({ message: 'Routine not found' })
      return
    }
    if (existing.userId !== req.userId) {
      res.status(403).json({ message: 'Access denied' })
      return
    }

    await deleteRoutine(id)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}