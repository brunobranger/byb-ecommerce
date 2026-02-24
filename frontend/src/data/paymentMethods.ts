import type { PaymentMethod } from '../types/paymentMethod'

// Hardcodeados por ahora
export const paymentMethods: PaymentMethod[] = [
    {
        id: 'cash',
        label: 'Efectivo / Transferencia',
        description: 'Pagá en efectivo por Rapipago o con transferencia bancaria',
    },
    {
        id: 'bank_deposit',
        label: 'Depósito bancario',
        description: 'Depositá el monto en nuestra cuenta bancaria',
    },
    {
        id: 'credit_card',
        label: 'Tarjeta de crédito',
        description: 'Pagá con tu tarjeta guardada en tu cuenta',
    },
    {
        id: 'mercado_pago',
        label: 'Mercado Pago',
        description: 'Serás redirigido a Mercado Pago para completar el pago',
    },
]
