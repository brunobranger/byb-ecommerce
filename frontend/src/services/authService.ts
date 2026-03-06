import type { User } from '../types/user'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

export interface AuthResponse {
    token: string
    user: User
}

export const authService = {
    login: async (email: string, password: string): Promise<AuthResponse> => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        })
        if (!res.ok) {
            const data = (await res.json()) as { message: string }
            throw new Error(data.message)
        }
        return res.json()
    },

    register: async (fullName: string, email: string, password: string): Promise<AuthResponse> => {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName, email, password }),
        })
        if (!res.ok) {
            const data = (await res.json()) as { message: string }
            throw new Error(data.message)
        }
        return res.json()
    },

    me: async (token: string): Promise<User> => {
        const res = await fetch(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error('Session expired')
        return res.json()
    },
}
