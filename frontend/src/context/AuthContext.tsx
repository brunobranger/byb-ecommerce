import { createContext, useContext, useState, useEffect } from 'react'
import type { User } from '../types/user'
import type { ReactNode } from 'react'
import { authService } from '../services/authService'

interface AuthContextType {
    user: User | null
    login: (email: string, password: string) => Promise<void>
    register: (fullName: string, email: string, password: string) => Promise<void>
    logout: () => void
    isAuthenticated: boolean
    loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    // Al cargar la app, validamos el token guardado contra el backend
    useEffect(() => {
        const token = localStorage.getItem('app_token')
        if (!token) {
            setLoading(false)
            return
        }

        authService
            .me(token)
            .then(userData => setUser(userData))
            .catch(() => localStorage.removeItem('app_token'))
            .finally(() => setLoading(false))
    }, [])

    const login = async (email: string, password: string) => {
        setLoading(true)
        try {
            const { token } = await authService.login(email, password)
            localStorage.setItem('app_token', token)
            // Traemos el usuario completo desde /me
            const freshUser = await authService.me(token)
            setUser(freshUser)
        } catch (error) {
            throw error
        } finally {
            setLoading(false)
        }
    }

    const register = async (fullName: string, email: string, password: string): Promise<void> => {
        setLoading(true)
        try {
            const { token } = await authService.register(fullName, email, password)
            localStorage.setItem('app_token', token)
            // Igual que en login, traemos el usuario completo desde /me
            const freshUser = await authService.me(token)
            setUser(freshUser)
        } catch (error) {
            throw error
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        // Al setear en null, todos los componentes (Navbar, etc)
        // que usen useAuth se actualizan de manera automatica (o sea, el nav que dice "Mi cuenta" o "Ingresar")
        localStorage.removeItem('app_token')
        setUser(null)
    }

    return (
        <AuthContext.Provider
            value={{ user, login, register, logout, isAuthenticated: !!user, loading }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider')
    return context
}
