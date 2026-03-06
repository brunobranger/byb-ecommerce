import { createContext, useState, useEffect, type ReactNode } from 'react'
import type { CartItem } from '../types/cart'
import type { Product } from '../types/product'
import { cartService } from '../services/cartService'
import { useAuth } from './AuthContext'

export interface CartContextType {
    cartItems: CartItem[]
    addToCart: (product: Product) => Promise<void>
    removeItem: (id: string) => Promise<void>
    updateQuantity: (id: string, action: 'inc' | 'dec') => Promise<void>
    clearCart: () => Promise<void>
    loading: boolean
}

export const CartContext = createContext<CartContextType | undefined>(undefined)

// Convierte el item del backend al formato CartItem del frontend
const normalizeCartItem = (item: Record<string, unknown>): CartItem => ({
    id: item['productId'] as string,
    name: item['name'] as string,
    slug: item['slug'] as string,
    imageUrl: item['imageUrl'] as string,
    price: item['price'] as number,
    priceList: item['priceList'] as number,
    quantity: item['quantity'] as number,
    stock: item['stock'] as number,
    category: item['category'] as CartItem['category'],
    isActive: true,
    creationDate: new Date(),
})

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [loading, setLoading] = useState(false)
    const { isAuthenticated } = useAuth()

    // Cuando el usuario se loguea, cargamos su carrito del backend
    // y mergeamos con lo que ya tenía en el carrito local antes de loguearse
    useEffect(() => {
        if (!isAuthenticated) return

        setLoading(true)
        cartService
            .getCart()
            .then(async serverCart => {
                const serverItems: CartItem[] = (serverCart.items ?? []).map(normalizeCartItem)

                // Mergeamos — los items locales que no están en el server los subimos
                const localOnlyItems = cartItems.filter(
                    local => !serverItems.some(s => s.id === local.id),
                )

                for (const item of localOnlyItems) {
                    await cartService.addItem(item.id, item.quantity)
                }

                // Volvemos a traer el carrito ya mergeado
                const merged = await cartService.getCart()
                setCartItems((merged.items ?? []).map(normalizeCartItem))
            })
            .catch(() => {
                // Si falla el fetch, dejamos el carrito local como estaba
            })
            .finally(() => setLoading(false))
    }, [isAuthenticated])

    const addToCart = async (product: Product): Promise<void> => {
        if (isAuthenticated) {
            // Usuario logueado — sincronizamos con el backend
            try {
                const cart = await cartService.addItem(product.id)
                setCartItems((cart.items ?? []).map(normalizeCartItem))
            } catch (error) {
                console.error('Error agregando al carrito:', error)
            }
        } else {
            // Usuario no logueado — solo local
            setCartItems(prev => {
                const existing = prev.find(item => item.id === product.id)
                if (existing) {
                    return prev.map(item =>
                        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
                    )
                }
                return [...prev, { ...product, quantity: 1 }]
            })
        }
    }

    const removeItem = async (id: string): Promise<void> => {
        if (isAuthenticated) {
            try {
                const cart = await cartService.removeItem(id)
                setCartItems((cart.items ?? []).map(normalizeCartItem))
            } catch (error) {
                console.error('Error eliminando item:', error)
            }
        } else {
            setCartItems(prev => prev.filter(item => item.id !== id))
        }
    }

    const updateQuantity = async (id: string, action: 'inc' | 'dec'): Promise<void> => {
        if (isAuthenticated) {
            try {
                const cart = await cartService.updateItem(id, action)
                setCartItems((cart.items ?? []).map(normalizeCartItem))
            } catch (error) {
                console.error('Error actualizando cantidad:', error)
            }
        } else {
            setCartItems(prev =>
                prev.map(item => {
                    if (item.id === id) {
                        const newQty = action === 'inc' ? item.quantity + 1 : item.quantity - 1
                        return newQty < 1 ? item : { ...item, quantity: newQty }
                    }
                    return item
                }),
            )
        }
    }

    const clearCart = async (): Promise<void> => {
        if (isAuthenticated) {
            try {
                await cartService.clearCart()
            } catch (error) {
                console.error('Error vaciando carrito:', error)
            }
        }
        setCartItems([])
    }

    return (
        <CartContext.Provider
            value={{ cartItems, addToCart, removeItem, updateQuantity, clearCart, loading }}
        >
            {children}
        </CartContext.Provider>
    )
}
