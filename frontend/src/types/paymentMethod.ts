export type PaymentMethodId = 'bank_deposit' | 'credit_card' | 'mercado_pago'

export interface PaymentMethod {
    id: PaymentMethodId
    label: string
    description: string
}
