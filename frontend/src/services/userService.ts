const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

const getToken = () => localStorage.getItem('app_token')

export const userService = {
    getMe: async () => {
        const res = await fetch(`${API_URL}/users/me`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        })
        if (!res.ok) throw new Error('Error obteniendo perfil')
        return res.json()
    },

    updateMe: async (data: Record<string, string>) => {
        const res = await fetch(`${API_URL}/users/me`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(data),
        })
        if (!res.ok) throw new Error('Error actualizando perfil')
        return res.json()
    },
}
