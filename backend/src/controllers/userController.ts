import type { Response } from 'express'
import type { AuthRequest } from '../middleware/auth'
import User from '../models/User'

// GET /api/users/me
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.userId).select('-password')
        if (!user) {
            res.status(404).json({ message: 'Usuario no encontrado' })
            return
        }
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo perfil' })
    }
}

// PUT /api/users/me
export const updateMe = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // Campos que el usuario puede modificar — excluimos role, clientNumber y password
        const { fullName, phone, claseFiscal, tipoDocumento, dni, province, address, postalCode } =
            req.body

        const updated = await User.findByIdAndUpdate(
            req.userId,
            { fullName, phone, claseFiscal, tipoDocumento, dni, province, address, postalCode },
            { new: true, runValidators: true },
        ).select('-password')

        if (!updated) {
            res.status(404).json({ message: 'Usuario no encontrado' })
            return
        }

        res.json(updated)
    } catch (error) {
        res.status(500).json({ message: 'Error actualizando perfil' })
    }
}
