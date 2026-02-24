export interface Installment {
    id: string
    label: string
    // delta puede ser negativo, cero o positivo — se aplica SOLO sobre priceList
    // Nunca sobre price ni de forma acumulativa
    delta: number
}

// Deltas sobre priceList:
// -0.05 → 5% menos que priceList   (1 pago)
// -0.02 → 2% menos que priceList   (3 cuotas)
//  0    → exactamente priceList     (6 cuotas sin interés)
// +0.10 → 10% más que priceList    (12 cuotas)
export const installments: Installment[] = [
    { id: '1', label: '1 pago', delta: -0.05 },
    { id: '3', label: '3 cuotas', delta: -0.02 },
    { id: '6', label: '6 cuotas sin interés', delta: 0 },
    { id: '12', label: '12 cuotas', delta: +0.1 },
]
