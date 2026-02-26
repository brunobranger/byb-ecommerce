import type { CartItem } from './cart'
import type { PaymentMethodId } from './paymentMethod'

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'

export interface Order {
    id?: string // Generado por DB (MongoDB)
    userId: string // Referencia al ID del AuthContext
    createdAt: Date
    status: OrderStatus

    // Datos del Carrito
    items: CartItem[]
    subtotal: number // Suma de precios normales
    total: number // Suma final (con recargos/envío)

    // Logística y Pago
    shipping: {
        carrierId: string // Relación con Carrier.id
        price: number
        address: {
            street: string
            number: string
            city: string
            zipCode: string
        }
    }

    payment: {
        methodId: PaymentMethodId
        installments?: number
        surcharge?: number // El recargo de tarjeta
    }
}
