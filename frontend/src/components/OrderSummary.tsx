import { Link } from 'react-router'
import { useCart } from '../hooks/useCart'

type Step = 'cart' | 'shipping' | 'payment'

interface OrderSummaryProps {
    step: Step
    onNext: () => void
    onBack: () => void
    shippingCost: number | null // null = no elegido todavía, 0 = retiro gratis
    canContinue: boolean // habilita/deshabilita el botón de continuar
}

const OrderSummary = ({ step, onNext, onBack, shippingCost, canContinue }: OrderSummaryProps) => {
    const { cartItems } = useCart()

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    const total = subtotal + (shippingCost ?? 0)

    return (
        <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-3xl p-8 sticky top-24 backdrop-blur-md">
            <h2 className="text-xl font-bold uppercase tracking-tight mb-6">Resumen</h2>

            <ul className="space-y-4 mb-6">
                <li className="flex justify-between items-center">
                    <span>
                        {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'}
                    </span>
                    <span className="font-bold">$ {subtotal.toLocaleString()}</span>
                </li>

                {/* Fila de envío — solo aparece en el step de shipping */}
                {step === 'shipping' && (
                    <li className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Envío</span>
                        <span className="font-semibold">
                            {shippingCost === null && '—'}
                            {shippingCost === 0 && <span className="text-blue-600">Gratis</span>}
                            {shippingCost !== null &&
                                shippingCost > 0 &&
                                `$ ${shippingCost.toLocaleString()}`}
                        </span>
                    </li>
                )}

                <li className="flex gap-2 items-start text-xs text-blue-400 bg-white p-3 rounded-lg border border-blue-500/30">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5 shrink-0"
                    >
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span>Precio en efectivo o transferencia / deposito bancario</span>
                </li>
            </ul>

            <hr className="border-white/10 mb-6" />

            <div className="flex justify-between items-center mb-6">
                <span className="text-xl">Total</span>
                <span className="text-2xl font-bold text-blue-500">
                    $ {total.toLocaleString()}*
                </span>
            </div>

            <div className="flex flex-col gap-3">
                {step === 'cart' ? (
                    <>
                        {/* Step: carrito — Iniciar compra + Ver más productos */}
                        <button
                            type="button"
                            onClick={onNext}
                            className="w-full bg-blue-900 hover:bg-blue-800 py-4 rounded-xl font-bold uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-blue-950/50 text-white"
                        >
                            Iniciar compra
                        </button>

                        <Link
                            to="/productos"
                            className="w-full py-3 rounded-xl border border-blue-900 text-blue-400 font-bold hover:bg-blue-900/10 transition-colors text-center text-sm"
                        >
                            VER MÁS PRODUCTOS
                        </Link>
                    </>
                ) : (
                    <>
                        {/* Step: shipping o payment — Continuar + Anterior */}
                        {step === 'shipping' && (
                            <button
                                type="button"
                                onClick={onNext}
                                disabled={!canContinue}
                                className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all text-white
                                    ${
                                        canContinue
                                            ? 'bg-blue-900 hover:bg-blue-800 active:scale-95 shadow-lg shadow-blue-950/50'
                                            : 'bg-blue-900/30 cursor-not-allowed'
                                    }`}
                            >
                                Continuar
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={onBack}
                            className="w-full py-3 rounded-xl border border-blue-900 text-blue-900 font-bold hover:bg-blue-900/10 transition-colors text-center text-sm"
                        >
                            Anterior
                        </button>
                    </>
                )}
            </div>

            <p className="text-[10px] text-gray-500 mt-4 text-center">
                *Precio abonando con depósito o transferencia.
            </p>
        </div>
    )
}

export default OrderSummary
