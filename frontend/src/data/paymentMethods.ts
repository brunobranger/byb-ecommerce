import type { PaymentMethod } from '../types/paymentMethod'

export const paymentMethods: PaymentMethod[] = [
    {
        id: 'bank_deposit',
        label: 'Transferencia / Depósito bancario',
        description: 'Transferí o depositá el monto en nuestra cuenta bancaria',
    },
    {
        id: 'credit_card',
        label: 'Tarjeta de crédito',
        description: 'Pagá con tu tarjeta de crédito en cuotas',
    },
    {
        id: 'mercado_pago',
        label: 'Mercado Pago',
        description: 'Serás redirigido a Mercado Pago para completar el pago',
    },
]
