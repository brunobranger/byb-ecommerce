import { paymentMethods } from '../types/paymentMethods'
import type { PaymentMethodId } from '../types/paymentMethod'

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
                            {method.id === 'cash' && <CashDetail />}
                            {method.id === 'bank_deposit' && <BankDepositDetail />}
                            {method.id === 'credit_card' && <CreditCardDetail />}
                            {method.id === 'mercado_pago' && <MercadoPagoDetail />}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

// --- Sub-componentes de detalle ---

const CashDetail = () => (
    <div className="flex flex-col gap-4">
        <p className="text-xs text-gray-400 uppercase tracking-widest">Seleccioná cómo pagás</p>

        {/* Rapipago */}
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 text-blue-900"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
                        />
                    </svg>
                </div>
                <div>
                    <p className="font-semibold text-black text-sm">Rapipago</p>
                    <p className="text-xs text-gray-400">Pagá en efectivo en cualquier sucursal</p>
                </div>
            </div>
            <span className="text-xs text-blue-600 font-semibold border border-blue-200 rounded-lg px-3 py-1">
                Próximamente
            </span>
        </div>

        {/* Transferencia */}
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 text-blue-900"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                        />
                    </svg>
                </div>
                <div>
                    <p className="font-semibold text-black text-sm">Transferencia bancaria</p>
                    <p className="text-xs text-gray-400">Te enviamos los datos al confirmar</p>
                </div>
            </div>
        </div>
    </div>
)

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

const MercadoPagoDetail = () => (
    <div className="flex flex-col items-center justify-center py-4 gap-4 text-center">
        <div className="flex flex-col gap-1">
            <p className="font-semibold text-black">Serás redirigido a Mercado Pago</p>
            <p className="text-xs text-gray-400">
                Completá el pago de forma segura en la plataforma de Mercado Pago.
            </p>
        </div>
        <button
            type="button"
            disabled
            className="bg-blue-500/20 text-blue-900/40 font-bold py-3 px-8 rounded-xl cursor-not-allowed text-sm uppercase tracking-widest"
        >
            Ir a Mercado Pago
        </button>
        <p className="text-xs text-gray-400">Integración disponible próximamente.</p>
    </div>
)

export default PaymentMethod
