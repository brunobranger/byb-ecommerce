import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
    userId?: string
    userRole?: string
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
    console.log('=== AUTH MIDDLEWARE ===')
    console.log('1. Headers recibidos:', Object.keys(req.headers))
    console.log('2. Authorization header completo:', req.headers.authorization)
    console.log('3. JWT_SECRET existe:', !!process.env.JWT_SECRET)

    const token = req.headers.authorization?.split(' ')[1] // Bearer <token>
    console.log('4. Token extraído:', token?.slice(0, 20) + '...')

    if (!token) {
        console.log('❌ No token provided')
        res.status(401).json({ message: 'Token requerido' })
        return
    }

    try {
        const secret = process.env.JWT_SECRET
        if (!secret) {
            console.log('❌ JWT_SECRET no definida')
            throw new Error('JWT_SECRET no definida')
        }

        console.log('5. Verificando token con secret...')
        const decoded = jwt.verify(token, secret) as { userId: string; role: string }
        console.log('✅ Token decodificado OK')
        console.log('6. User ID:', decoded.userId)
        console.log('7. User Role:', decoded.role)

        req.userId = decoded.userId
        req.userRole = decoded.role
        console.log('8. req.userId asignado:', req.userId)
        console.log('9. req.userRole asignado:', req.userRole)
        next()
    } catch (error) {
        console.log('❌ Error verificando token:', error)
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
