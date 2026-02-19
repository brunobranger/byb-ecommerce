import { createContext, useState, type ReactNode } from 'react'
import type { CartItem } from '../types/cart'
import type { Product } from '../types/product'

export interface CartContextType {
    cartItems: CartItem[]
    addToCart: (product: Product) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, action: 'inc' | 'dec') => void
}

export const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([])

    const addToCart = (product: Product) => {
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

    const removeItem = (id: string) => {
        setCartItems(prev => prev.filter(item => item.id !== id))
    }

    const updateQuantity = (id: string, action: 'inc' | 'dec') => {
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

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeItem, updateQuantity }}>
            {children}
        </CartContext.Provider>
    )
}
