import type { Product } from '../types/product'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

// Transforma _id de MongoDB a id para que coincida con el tipo Product del frontend
const normalizeProduct = (p: Record<string, unknown>) => ({
    ...p,
    id: p['_id'] as string,
})

const getToken = () => localStorage.getItem('app_token')

export const productService = {
    getAll: async (params?: {
        category?: string
        subcategory?: string
        search?: string
        sort?: string
    }): Promise<Product[]> => {
        const query = new URLSearchParams()
        if (params?.category) query.set('category', params.category)
        if (params?.subcategory) query.set('subcategory', params.subcategory)
        if (params?.search) query.set('search', params.search)
        if (params?.sort) query.set('sort', params.sort)

        const res = await fetch(`${API_URL}/products?${query.toString()}`)
        if (!res.ok) throw new Error('Error obteniendo productos')
        const data = await res.json()
        return data.map(normalizeProduct) as Product[]
    },

    getBySlug: async (slug: string): Promise<Product> => {
        const res = await fetch(`${API_URL}/products/slug/${slug}`)
        if (!res.ok) throw new Error('Producto no encontrado')
        const data = await res.json()
        return normalizeProduct(data) as Product
    },

    createProduct: async (data: Record<string, unknown>): Promise<Product> => {
        const res = await fetch(`${API_URL}/products`, {
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
        return normalizeProduct(await res.json()) as Product
    },

    updateProduct: async (id: string, data: Record<string, unknown>): Promise<Product> => {
        const res = await fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
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
        return normalizeProduct(await res.json()) as Product
    },
}
