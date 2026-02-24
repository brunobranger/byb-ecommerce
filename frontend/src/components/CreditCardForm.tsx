import { useState } from 'react'
import { installments } from '../data/installments'

interface CreditCardFormData {
    cardNumber: string
    cardHolder: string
    expiryDate: string
    cvv: string
}

interface CreditCardFormProps {
    // delta es el ajuste de precio de la cuota elegida — puede ser negativo, cero o positivo
    onDataChange: (data: CreditCardFormData, isValid: boolean, delta: number) => void
}

type CardBrand = 'visa' | 'mastercard' | 'amex' | 'naranja' | 'cabal' | null

// Detecta la marca según el número ingresado
const detectBrand = (number: string): CardBrand => {
    const clean = number.replace(/\s/g, '')
    if (/^4/.test(clean)) return 'visa'
    if (/^5[1-5]/.test(clean) || /^2[2-7]/.test(clean)) return 'mastercard'
    if (/^3[47]/.test(clean)) return 'amex'
    if (/^589562/.test(clean)) return 'naranja'
    if (/^604201|^6042/.test(clean)) return 'cabal'
    return null
}

// Formatea el número en grupos de 4 (o 4-6-5 para Amex)
const formatCardNumber = (value: string, brand: CardBrand): string => {
    const clean = value.replace(/\D/g, '')
    if (brand === 'amex') {
        return clean.replace(/(\d{4})(\d{0,6})(\d{0,5})/, (_, a, b, c) =>
            [a, b, c].filter(Boolean).join(' '),
        )
    }
    return clean.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
}

// Formatea la fecha de vencimiento
const formatExpiry = (value: string): string => {
    const clean = value.replace(/\D/g, '')
    if (clean.length >= 3) return `${clean.slice(0, 2)}/${clean.slice(2, 4)}`
    return clean
}

const brandLogos: Record<Exclude<CardBrand, null>, string> = {
    visa: 'VISA',
    mastercard: 'MC',
    amex: 'AMEX',
    naranja: 'NARANJA',
    cabal: 'CABAL',
}

const brandColors: Record<Exclude<CardBrand, null>, string> = {
    visa: 'text-blue-700 bg-blue-50 border-blue-200',
    mastercard: 'text-red-600 bg-red-50 border-red-200',
    amex: 'text-green-700 bg-green-50 border-green-200',
    naranja: 'text-orange-600 bg-orange-50 border-orange-200',
    cabal: 'text-blue-600 bg-blue-50 border-blue-200',
}

const CreditCardForm = ({ onDataChange }: CreditCardFormProps) => {
    const [form, setForm] = useState<CreditCardFormData>({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: '',
    })
    const [brand, setBrand] = useState<CardBrand>(null)
    const [showCvv, setShowCvv] = useState(false)

    // Cuota seleccionada — arranca en null para forzar al usuario a elegir
    const [selectedInstallment, setSelectedInstallment] = useState<string | null>(null)

    const validate = (data: CreditCardFormData): boolean => {
        const cleanNumber = data.cardNumber.replace(/\s/g, '')
        return (
            cleanNumber.length >= 15 &&
            data.cardHolder.trim().length >= 3 &&
            /^\d{2}\/\d{2}$/.test(data.expiryDate) &&
            data.cvv.length >= 3
        )
    }

    // Notifica al padre con el delta de la cuota elegida
    const notify = (data: CreditCardFormData, installmentId: string | null) => {
        const delta = installments.find(i => i.id === installmentId)?.delta ?? 0
        // El form es válido solo si los campos están completos Y eligió cuota
        onDataChange(data, validate(data) && installmentId !== null, delta)
    }

    const handleCardNumber = (value: string) => {
        const detectedBrand = detectBrand(value.replace(/\s/g, ''))
        setBrand(detectedBrand)
        const formatted = formatCardNumber(value, detectedBrand)
        const maxLength = detectedBrand === 'amex' ? 17 : 19
        if (formatted.length > maxLength) return
        const updated = { ...form, cardNumber: formatted }
        setForm(updated)
        notify(updated, selectedInstallment)
    }

    const handleExpiry = (value: string) => {
        const formatted = formatExpiry(value)
        if (formatted.length > 5) return
        const updated = { ...form, expiryDate: formatted }
        setForm(updated)
        notify(updated, selectedInstallment)
    }

    const handleField = (field: keyof CreditCardFormData, value: string) => {
        const updated = { ...form, [field]: value }
        setForm(updated)
        notify(updated, selectedInstallment)
    }

    const handleInstallment = (id: string) => {
        setSelectedInstallment(id)
        notify(form, id)
    }

    return (
        <div className="flex flex-col gap-5">
            {/* Número de tarjeta */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-400 uppercase tracking-widest">
                    Número de tarjeta
                </label>
                <div className="relative">
                    <input
                        type="text"
                        inputMode="numeric"
                        placeholder="0000 0000 0000 0000"
                        value={form.cardNumber}
                        onChange={e => handleCardNumber(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-black font-mono text-sm focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all pr-24"
                    />
                    {/* Badge de marca detectada */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {brand ? (
                            <span
                                className={`text-xs font-bold px-2 py-1 rounded-lg border ${brandColors[brand]}`}
                            >
                                {brandLogos[brand]}
                            </span>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-5 h-5 text-gray-300"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                                />
                            </svg>
                        )}
                    </div>
                </div>
            </div>

            {/* Titular */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-400 uppercase tracking-widest">
                    Nombre del titular
                </label>
                <input
                    type="text"
                    placeholder="Como figura en la tarjeta"
                    value={form.cardHolder}
                    onChange={e => handleField('cardHolder', e.target.value.toUpperCase())}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-black font-mono text-sm focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all"
                />
            </div>

            {/* Vencimiento + CVV */}
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-gray-400 uppercase tracking-widest">
                        Vencimiento
                    </label>
                    <input
                        type="text"
                        inputMode="numeric"
                        placeholder="MM/AA"
                        value={form.expiryDate}
                        onChange={e => handleExpiry(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-black font-mono text-sm focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-gray-400 uppercase tracking-widest">CVV</label>
                    <div className="relative">
                        <input
                            type={showCvv ? 'text' : 'password'}
                            inputMode="numeric"
                            placeholder="•••"
                            value={form.cvv}
                            maxLength={brand === 'amex' ? 4 : 3}
                            onChange={e => handleField('cvv', e.target.value.replace(/\D/g, ''))}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-black font-mono text-sm focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowCvv(v => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                        >
                            {showCvv ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-4 h-4"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-4 h-4"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Selector de cuotas */}
            <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-400 uppercase tracking-widest">Cuotas</label>
                <div className="flex flex-col gap-2">
                    {installments.map((installment, index) => (
                        <div key={installment.id}>
                            <button
                                type="button"
                                onClick={() => handleInstallment(installment.id)}
                                className="w-full flex items-center justify-between py-3 px-1 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    {/* Radio custom */}
                                    <div
                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0
                                        ${selectedInstallment === installment.id ? 'border-blue-900' : 'border-gray-300'}`}
                                    >
                                        {selectedInstallment === installment.id && (
                                            <div className="w-2.5 h-2.5 rounded-full bg-blue-900" />
                                        )}
                                    </div>
                                    <span className="text-sm font-medium text-black">
                                        {installment.label}
                                    </span>
                                </div>
                                {/* Delta: sin interés, descuento o recargo */}
                                {installment.delta === 0 ? (
                                    <span className="text-xs font-semibold text-blue-600 border border-blue-200 rounded-lg px-2 py-0.5">
                                        Sin interés
                                    </span>
                                ) : installment.delta < 0 ? (
                                    <span className="text-xs font-semibold text-green-600 border border-green-200 rounded-lg px-2 py-0.5">
                                        -{Math.round(Math.abs(installment.delta) * 100)}%
                                    </span>
                                ) : (
                                    <span className="text-xs text-gray-400">
                                        +{Math.round(installment.delta * 100)}%
                                    </span>
                                )}
                            </button>
                            {index < installments.length - 1 && <hr className="border-gray-100" />}
                        </div>
                    ))}
                </div>
            </div>

            <p className="text-xs text-gray-400 text-center">
                Tus datos están protegidos con encriptación SSL.
            </p>
        </div>
    )
}

export default CreditCardForm
export type { CreditCardFormData }
