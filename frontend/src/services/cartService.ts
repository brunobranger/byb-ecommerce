const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

const getToken = () => localStorage.getItem('app_token')

export const cartService = {
    getCart: async () => {
        const res = await fetch(`${API_URL}/cart`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        })
        if (!res.ok) throw new Error('Error obteniendo carrito')
        return res.json()
    },

    addItem: async (productId: string, quantity = 1) => {
        const res = await fetch(`${API_URL}/cart/items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({ productId, quantity }),
        })
        if (!res.ok) throw new Error('Error agregando item')
        return res.json()
    },

    updateItem: async (productId: string, action: 'inc' | 'dec') => {
        const res = await fetch(`${API_URL}/cart/items/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({ action }),
        })
        if (!res.ok) throw new Error('Error actualizando item')
        return res.json()
    },

    removeItem: async (productId: string) => {
        const res = await fetch(`${API_URL}/cart/items/${productId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${getToken()}` },
        })
        if (!res.ok) throw new Error('Error eliminando item')
        return res.json()
    },

    clearCart: async () => {
        const res = await fetch(`${API_URL}/cart`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${getToken()}` },
        })
        if (!res.ok) throw new Error('Error vaciando carrito')
        return res.json()
    },
}
