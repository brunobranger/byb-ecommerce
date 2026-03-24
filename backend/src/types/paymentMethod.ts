export type PaymentMethodId = 'cash' | 'bank_deposit' | 'credit_card' | 'mercado_pago'

export interface PaymentMethod {
    id: PaymentMethodId
    label: string
    description: string
}
