import type { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User'

const generateToken = (userId: string, role: string): string => {
    const secret = process.env.JWT_SECRET
    if (!secret) throw new Error('JWT_SECRET no definida')
    return jwt.sign({ userId, role }, secret, { expiresIn: '7d' })
}

// POST /api/auth/register
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { fullName, email, password } = req.body

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            res.status(400).json({ message: 'El email ya está registrado' })
            return
        }

        // Generamos clientNumber autoincremental
        const count = await User.countDocuments()
        const clientNumber = String(count + 1).padStart(6, '0')

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            fullName,
            email,
            password: hashedPassword,
            clientNumber,
        })

        const token = generateToken(user.id as string, user.role)

        res.status(201).json({
            token,
            user: {
                id: user.id,
                clientNumber: user.clientNumber,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
            },
        })
    } catch (error) {
        res.status(500).json({ message: 'Error en el registro' })
    }
}

// POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user) {
            res.status(401).json({ message: 'Credenciales inválidas' })
            return
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            res.status(401).json({ message: 'Credenciales inválidas' })
            return
        }

        const token = generateToken(user.id as string, user.role)

        res.json({
            token,
            user: {
                id: user.id,
                clientNumber: user.clientNumber,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
            },
        })
    } catch (error) {
        res.status(500).json({ message: 'Error en el login' })
    }
}

// GET /api/auth/me
export const me = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as { userId?: string }).userId
        const user = await User.findById(userId).select('-password')
        if (!user) {
            res.status(404).json({ message: 'Usuario no encontrado' })
            return
        }
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo usuario' })
    }
}
