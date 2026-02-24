import { Link } from 'react-router'
import type { PaymentMethodId } from '../types/paymentMethod'

interface OrderConfirmationProps {
    success: boolean
    paymentMethod: PaymentMethodId
    orderNumber: string
    onRetry?: () => void
}

const successMessages: Record<PaymentMethodId, { title: string; body: string }> = {
    cash: {
        title: '¡Pedido confirmado!',
        body: 'Te enviaremos por mail los datos para realizar la transferencia o el código de pago por Rapipago. Una vez confirmado el pago, tu pedido será procesado.',
    },
    bank_deposit: {
        title: '¡Pedido confirmado!',
        body: 'Realizá el depósito con los datos bancarios que te enviamos por mail y adjuntá el comprobante para que podamos procesar tu pedido.',
    },
    credit_card: {
        title: '¡Pago aprobado!',
        body: 'Tu pago fue procesado correctamente. Recibirás un mail con la confirmación y el seguimiento de tu pedido.',
    },
    mercado_pago: {
        title: '¡Pago aprobado!',
        body: 'Tu pago fue procesado correctamente a través de Mercado Pago. Recibirás un mail con la confirmación y el seguimiento de tu pedido.',
    },
}

const OrderConfirmation = ({
    success,
    paymentMethod,
    orderNumber,
    onRetry,
}: OrderConfirmationProps) => {
    const message = successMessages[paymentMethod]

    return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center gap-6 py-12">
            {success ? (
                <>
                    {/* Ícono éxito */}
                    <div className="w-20 h-20 rounded-full bg-blue-50 border-2 border-blue-900 flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                            className="w-10 h-10 text-blue-900"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m4.5 12.75 6 6 9-13.5"
                            />
                        </svg>
                    </div>

                    <div className="flex flex-col gap-2 max-w-md">
                        <h2 className="text-2xl font-bold text-black">{message.title}</h2>
                        <p className="text-gray-500 text-sm leading-relaxed">{message.body}</p>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-xl px-6 py-3 flex flex-col gap-1">
                        <span className="text-xs text-gray-400 uppercase tracking-widest">
                            Número de pedido
                        </span>
                        <span className="font-mono font-bold text-blue-900 text-lg">
                            {orderNumber}
                        </span>
                    </div>

                    <Link
                        to="/productos"
                        className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-xl uppercase tracking-widest transition-all active:scale-95 text-sm"
                    >
                        Seguir comprando
                    </Link>
                </>
            ) : (
                <>
                    {/* Ícono error */}
                    <div className="w-20 h-20 rounded-full bg-red-50 border-2 border-red-400 flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                            className="w-10 h-10 text-red-400"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18 18 6M6 6l12 12"
                            />
                        </svg>
                    </div>

                    <div className="flex flex-col gap-2 max-w-md">
                        <h2 className="text-2xl font-bold text-black">Hubo un problema</h2>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            No pudimos procesar tu pago. Verificá los datos de tu tarjeta e intentá
                            nuevamente.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 w-full max-w-xs">
                        {onRetry && (
                            <button
                                type="button"
                                onClick={onRetry}
                                className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 rounded-xl uppercase tracking-widest transition-all active:scale-95 text-sm"
                            >
                                Reintentar
                            </button>
                        )}
                        <Link
                            to="/"
                            className="w-full text-center py-3 rounded-xl border border-blue-900 text-blue-900 font-bold hover:bg-blue-900/10 transition-colors text-sm"
                        >
                            Volver al inicio
                        </Link>
                    </div>
                </>
            )}
        </div>
    )
}

export default OrderConfirmation
