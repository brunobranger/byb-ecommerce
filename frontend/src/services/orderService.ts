const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'
const getToken = () => localStorage.getItem('app_token')

export const orderService = {
    createOrder: async (data: {
        shippingOption: 'pickup' | 'delivery'
        carrier?: string
        shippingCost: number
        deliveryAddress?: {
            street: string
            city: string
            zip: string
            name: string
            phone: string
        }
        paymentMethod: string
        subtotal: number
        total: number
    }) => {
        const res = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(data),
        })
        if (!res.ok) {
            const error = (await res.json()) as { message: string }
            throw new Error(error.message)
        }
        return res.json()
    },

    getMyOrders: async () => {
        const res = await fetch(`${API_URL}/orders`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        })
        if (!res.ok) throw new Error('Error obteniendo órdenes')
        return res.json()
    },

    // Agregá esto al objeto orderService existente:
    createPreference: async (orderNumber: string) => {
        const res = await fetch(`${API_URL}/payments/create-preference`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({ orderNumber }),
        })
        if (!res.ok) throw new Error('Error creando preferencia de pago')
        return res.json() as Promise<{
            preferenceId: string
            initPoint: string
            sandboxInitPoint: string
        }>
    },
}
