import type { CartItem } from '../types/cart'
import type { PaymentMethodId } from '../types/paymentMethod'

// Modelo:
//   - Pago no tarjeta → sum(item.price * qty)
//   - Pago con tarjeta → sum(item.priceList * qty) * (1 + delta)
//
// El delta puede ser negativo, cero o positivo.
// NUNCA se acumula: no existe price * 1.20 * (1 + algo).
export const calculateSubtotal = (
    cartItems: CartItem[],
    paymentMethod: PaymentMethodId | null,
    installmentDelta: number,
): number => {
    const subtotalBase = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

    if (paymentMethod !== 'credit_card') return subtotalBase

    const subtotalList = cartItems.reduce((acc, item) => acc + item.priceList * item.quantity, 0)

    // Aplicamos el delta sobre priceList — único punto donde ocurre este cálculo
    return Math.round(subtotalList * (1 + installmentDelta))
}
