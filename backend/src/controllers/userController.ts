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

// POST /api/users/addresses
export const addAddress = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.userId)
        if (!user) {
            res.status(404).json({ message: 'Usuario no encontrado' })
            return
        }

        // En Mongoose, push() sobre un subdocumento devuelve la nueva longitud
        user.addresses.push(req.body)

        // Si es la primera, la marcamos como default
        if (user.addresses.length === 1) {
            user.addresses[0].isDefault = true
        }

        await user.save()
        res.status(201).json(user.addresses)
    } catch (error) {
        res.status(500).json({ message: 'Error agregando dirección' })
    }
}

// PATCH /api/users/addresses/:addressId
export const updateAddress = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { addressId } = req.params as { addressId: string }

        const user = await User.findById(req.userId)
        if (!user) {
            res.status(404).json({ message: 'Usuario no encontrado' })
            return
        }

        const addr = user.addresses.id(addressId)
        if (!addr) {
            res.status(404).json({ message: 'Dirección no encontrada' })
            return
        }

        Object.assign(addr, req.body)
        await user.save()
        res.json(user.addresses)
    } catch (error) {
        res.status(500).json({ message: 'Error actualizando dirección' })
    }
}

// DELETE /api/users/addresses/:addressId
export const deleteAddress = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { addressId } = req.params as { addressId: string }

        const user = await User.findById(req.userId)
        if (!user) {
            res.status(404).json({ message: 'Usuario no encontrado' })
            return
        }

        const addr = user.addresses.id(addressId)
        if (!addr) {
            res.status(404).json({ message: 'Dirección no encontrada' })
            return
        }

        addr.deleteOne()

        // Si se eliminó la default y quedan direcciones, la primera pasa a ser default
        if (user.addresses.length > 0 && !user.addresses.some(a => a.isDefault)) {
            user.addresses[0].isDefault = true
        }

        await user.save() // 👈 faltaba esto
        res.json(user.addresses) // 👈 y esto
    } catch (error) {
        res.status(500).json({ message: 'Error eliminando dirección' })
    }
}

// PATCH /api/users/addresses/:addressId/default
export const setDefaultAddress = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // 1. Casteamos params para asegurar que addressId es un string único
        const { addressId } = req.params as { addressId: string }

        const user = await User.findById(req.userId)
        if (!user) {
            res.status(404).json({ message: 'Usuario no encontrado' })
            return
        }

        // 2. Usamos una comparación segura
        user.addresses.forEach(a => {
            // Usamos String(a._id) para evitar el error de 'never'
            // y asegurar la comparación con el string de la URL
            a.isDefault = String(a._id) === addressId
        })

        await user.save()
        res.json(user.addresses)
    } catch (error) {
        res.status(500).json({ message: 'Error estableciendo dirección principal' })
    }
}
