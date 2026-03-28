import { paymentMethods } from '../data/paymentMethods'
import type { PaymentMethodId } from '../types/paymentMethod'
import MercadoPagoDetail from './MercadoPagoDetail'

// Datos bancarios hardcodeados por ahora
const bankDetails = {
    bank: 'Banco Galicia',
    accountType: 'Cuenta Corriente',
    cbu: '0070999130000123456789',
    alias: 'BYB.TIENDA.PAGOS',
    holder: 'ByB Store S.R.L.',
    cuit: '30-12345678-9',
}

interface PaymentMethodProps {
    selected: PaymentMethodId | null
    onSelect: (id: PaymentMethodId) => void
}

const PaymentMethod = ({ selected, onSelect }: PaymentMethodProps) => {
    return (
        <div className="flex flex-col gap-4">
            {paymentMethods.map(method => (
                <div
                    key={method.id}
                    className={`bg-white border rounded-2xl shadow-sm transition-all overflow-hidden
                        ${selected === method.id ? 'border-blue-900 ring-2 ring-blue-900/20' : 'border-gray-200'}`}
                >
                    {/* Cabecera clickeable */}
                    <button
                        type="button"
                        onClick={() => onSelect(method.id)}
                        className="w-full flex items-center justify-between p-6 text-left"
                    >
                        <div className="flex items-center gap-4">
                            {/* Radio custom */}
                            <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0
                                ${selected === method.id ? 'border-blue-900' : 'border-gray-300'}`}
                            >
                                {selected === method.id && (
                                    <div className="w-2.5 h-2.5 rounded-full bg-blue-900" />
                                )}
                            </div>
                            <div>
                                <span className="text-base font-semibold text-black uppercase tracking-wide">
                                    {method.label}
                                </span>
                                <p className="text-xs text-gray-400 mt-0.5 normal-case tracking-normal">
                                    {method.description}
                                </p>
                            </div>
                        </div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                            className={`w-5 h-5 text-blue-900 transition-transform shrink-0 ml-4
                                ${selected === method.id ? 'rotate-90' : ''}`}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m8.25 4.5 7.5 7.5-7.5 7.5"
                            />
                        </svg>
                    </button>

                    {/* Detalle expandido */}
                    {selected === method.id && (
                        <div className="px-6 pb-6 border-t border-gray-100 pt-5">
                            {method.id === 'bank_deposit' && <BankDepositDetail />}
                            {method.id === 'credit_card' && <CreditCardDetail />}
                            {method.id === 'mercado_pago' && (
                                <MercadoPagoDetail
                                    preferenceId={null}
                                    loading={false}
                                    error={null}
                                />
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

// --- Sub-componentes de detalle ---

const BankDepositDetail = () => (
    <div className="flex flex-col gap-3">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Datos bancarios</p>
        <div className="flex flex-col gap-2 bg-gray-50 rounded-xl p-4 text-sm">
            <div className="flex justify-between">
                <span className="text-gray-500">Banco</span>
                <span className="font-semibold text-black">{bankDetails.bank}</span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between">
                <span className="text-gray-500">Tipo de cuenta</span>
                <span className="font-semibold text-black">{bankDetails.accountType}</span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between">
                <span className="text-gray-500">Titular</span>
                <span className="font-semibold text-black">{bankDetails.holder}</span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between">
                <span className="text-gray-500">CUIT</span>
                <span className="font-semibold text-black">{bankDetails.cuit}</span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between items-center">
                <span className="text-gray-500">CBU</span>
                <span className="font-semibold text-black font-mono text-xs">
                    {bankDetails.cbu}
                </span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between">
                <span className="text-gray-500">Alias</span>
                <span className="font-semibold text-black">{bankDetails.alias}</span>
            </div>
        </div>
        <p className="text-xs text-gray-400">
            Una vez realizado el depósito, envianos el comprobante para confirmar tu pedido.
        </p>
    </div>
)

const CreditCardDetail = () => (
    <div className="flex flex-col items-center justify-center py-4 gap-2 text-center">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-10 h-10 text-blue-900/30"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
            />
        </svg>
        <p className="font-semibold text-black">Próximamente</p>
    </div>
)

export default PaymentMethod
