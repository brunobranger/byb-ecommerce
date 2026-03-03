import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
    userId?: string
    userRole?: string
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(' ')[1] // Bearer <token>

    if (!token) {
        res.status(401).json({ message: 'Token requerido' })
        return
    }

    try {
        const secret = process.env.JWT_SECRET
        if (!secret) throw new Error('JWT_SECRET no definida')

        const decoded = jwt.verify(token, secret) as { userId: string; role: string }
        req.userId = decoded.userId
        req.userRole = decoded.role
        next()
    } catch {
        res.status(401).json({ message: 'Token inválido o expirado' })
    }
}

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.userRole !== 'admin') {
        res.status(403).json({ message: 'Acceso denegado' })
        return
    }
    next()
}
