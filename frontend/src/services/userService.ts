import type { UserAddress } from '../types/user'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'
const getToken = () => localStorage.getItem('app_token')

export const userService = {
    getMe: async () => {
        const res = await fetch(`${API_URL}/users/me`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        })
        if (!res.ok) throw new Error('Error obteniendo usuario')
        return res.json()
    },

    updateMe: async (data: Record<string, unknown>) => {
        const res = await fetch(`${API_URL}/users/me`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(data),
        })
        if (!res.ok) throw new Error('Error actualizando usuario')
        return res.json()
    },

    // Gestionar direcciones
    addAddress: async (data: UserAddress) => {
        const res = await fetch(`${API_URL}/users/addresses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(data),
        })
        if (!res.ok) throw new Error('Error agregando dirección')
        return res.json()
    },

    updateAddress: async (addressId: string, data: UserAddress) => {
        const res = await fetch(`${API_URL}/users/addresses/${addressId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(data),
        })
        if (!res.ok) throw new Error('Error actualizando dirección')
        return res.json()
    },

    deleteAddress: async (addressId: string) => {
        const res = await fetch(`${API_URL}/users/addresses/${addressId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${getToken()}` },
        })
        if (!res.ok) throw new Error('Error eliminando dirección')
        return res.json()
    },

    setDefaultAddress: async (addressId: string) => {
        const res = await fetch(`${API_URL}/users/addresses/${addressId}/default`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${getToken()}` },
        })
        if (!res.ok) throw new Error('Error estableciendo dirección principal')
        return res.json()
    },
}
