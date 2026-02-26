import { createContext, useContext, useState, useEffect } from 'react'
import type { User } from '../types/user'
import type { ReactNode } from 'react'

interface AuthContextType {
    user: User | null
    login: (email: string, pass: string) => Promise<void>
    logout: () => void
    isAuthenticated: boolean
    loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    // Al cargar la app, buscamos si ya estaba logueado
    useEffect(() => {
        const savedUser = localStorage.getItem('app_user')
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser))
            } catch (e) {
                localStorage.removeItem('app_user')
            }
        }
        setLoading(false)
    }, [])

    const login = async (email: string, _pass: string) => {
        setLoading(true)
        // --- SIMULACIÓN DE API ---
        await new Promise(res => setTimeout(res, 1000))

        // Datos corregidos para que coincidan con el componente UserProfile
        const mockUser: User = {
            id: 'u-123456',
            clientNumber: '000001',
            fullName: 'Juan Pérez',
            email: email,
            phone: '11 1234-5678',
            claseFiscal: 'Consumidor Final',
            tipoDocumento: 'DNI',
            dni: '12345678',
            province: 'Buenos Aires',
            address: 'Av. Corrientes 1234', // Ahora es string plano como pediste
            postalCode: '1043',
            role: 'user',
        }

        // Guardamos en storage y en estado
        localStorage.setItem('app_user', JSON.stringify(mockUser))
        setUser(mockUser)
        setLoading(false)
    }

    const logout = () => {
        // Al setear en null, todos los componentes (Navbar, etc)
        // que usen useAuth se actualizan de manera automatica (o sea, el nav que dice "Mi cuenta" o "Ingresar")
        localStorage.removeItem('app_user')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider')
    return context
}
