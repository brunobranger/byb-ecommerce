import { useState } from 'react'
import { Link } from 'react-router'
import { useCart } from '../hooks/useCart'
import ProductList from '../components/ProductList'
import OrderSummary from '../components/OrderSummary'
import ShippingMethod from '../components/ShippingMethod'
import PaymentMethod from '../components/PaymentMethod'
import { shippingCarriers } from '../data/shippingCarriers'
import type { PaymentMethodId } from '../types/paymentMethod'

type Step = 'cart' | 'shipping' | 'payment'
type ShippingOption = 'pickup' | 'delivery' | null

const CartScreen = () => {
    const { cartItems } = useCart()
    const [step, setStep] = useState<Step>('cart')
    const [shippingOption, setShippingOption] = useState<ShippingOption>(null)
    const [selectedCarrier, setSelectedCarrier] = useState<string | null>(null)
    const [selectedPayment, setSelectedPayment] = useState<PaymentMethodId | null>(null)

    const isEmpty = cartItems.length === 0

    // Calculamos el costo de envío según el carrier seleccionado
    const shippingCost =
        shippingOption === 'delivery'
            ? (shippingCarriers.find(c => c.id === selectedCarrier)?.price ?? null)
            : shippingOption === 'pickup'
              ? 0
              : null

    // El botón de continuar en shipping se habilita solo si eligió una opción válida
    const canContinueFromShipping =
        shippingOption === 'pickup' || (shippingOption === 'delivery' && selectedCarrier !== null)

    const stepConfig = {
        cart: { title: 'Mi carrito', backTo: '/' as string | null },
        shipping: { title: 'Elegí la forma de entrega', backTo: null },
        payment: { title: 'Elegí el método de pago', backTo: null },
    }

    const { title, backTo } = stepConfig[step]

    const handleBack = () => {
        if (step === 'shipping') setStep('cart')
        if (step === 'payment') setStep('shipping')
    }

    return (
        <div className="w-full max-w-7xl mx-auto py-12 px-4">
            {/* Header con flecha y título */}
            <div className="flex items-center gap-4 mb-2">
                {backTo ? (
                    <Link
                        to={backTo}
                        className="text-blue-600 hover:text-blue-500 transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={3}
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 19.5L8.25 12l7.5-7.5"
                            />
                        </svg>
                    </Link>
                ) : (
                    <button
                        type="button"
                        onClick={() => setStep('cart')}
                        className="text-blue-600 hover:text-blue-500 transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={3}
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 19.5L8.25 12l7.5-7.5"
                            />
                        </svg>
                    </button>
                )}
                <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
            </div>

            <hr className="opacity-20 mb-8 border-black" />

            {/* Carrito */}
            {isEmpty ? (
                /* Carrito Vacío */
                <div className="min-h-[50vh] flex items-center justify-center flex-col">
                    <svg
                        width="100px"
                        height="100px"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g
                            id="SVGRepo_tracerCarrier"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                            {' '}
                            <g clipPath="url(#clip0_15_35)">
                                {' '}
                                <rect width="24" height="24" fill="white"></rect>{' '}
                                <path
                                    d="M5.33331 6H19.8672C20.4687 6 20.9341 6.52718 20.8595 7.12403L20.1095 13.124C20.0469 13.6245 19.6215 14 19.1172 14H16.5555H9.44442H7.99998"
                                    stroke="#000000"
                                    strokeLinejoin="round"
                                ></path>{' '}
                                <path
                                    d="M2 4H4.23362C4.68578 4 5.08169 4.30341 5.19924 4.74003L8.30076 16.26C8.41831 16.6966 8.81422 17 9.26638 17H19"
                                    stroke="#000000"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                ></path>{' '}
                                <circle
                                    cx="10"
                                    cy="20"
                                    r="1"
                                    stroke="#000000"
                                    strokeLinejoin="round"
                                ></circle>{' '}
                                <circle
                                    cx="17.5"
                                    cy="20"
                                    r="1"
                                    stroke="#000000"
                                    strokeLinejoin="round"
                                ></circle>{' '}
                            </g>{' '}
                            <defs>
                                {' '}
                                <clipPath id="clip0_15_35">
                                    {' '}
                                    <rect width="24" height="24" fill="white"></rect>{' '}
                                </clipPath>{' '}
                            </defs>{' '}
                        </g>
                    </svg>
                    <span className="text-2xl font-bold">Tu carrito esta vacío</span>
                    <span>Cuando agregues un producto, vas a poder verlo en este lugar.</span>
                    <Link
                        to="/productos"
                        className="bg-blue-900 p-2 rounded-lg text-lg text-white mt-10 hover:bg-blue-800 transition-all"
                    >
                        Ver productos
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* LADO IZQUIERDO — cambia según el step */}
                    <div className="lg:col-span-8">
                        {step === 'cart' && <ProductList />}
                        {step === 'shipping' && (
                            <ShippingMethod
                                selected={shippingOption}
                                onSelect={setShippingOption}
                                selectedCarrier={selectedCarrier}
                                onSelectCarrier={setSelectedCarrier}
                            />
                        )}
                        {step === 'payment' && (
                            <PaymentMethod
                                selected={selectedPayment}
                                onSelect={setSelectedPayment}
                            />
                        )}
                    </div>

                    {/* RESUMEN — siempre visible */}
                    <OrderSummary
                        step={step}
                        onNext={() => setStep(step === 'cart' ? 'shipping' : 'payment')}
                        onBack={handleBack}
                        shippingCost={shippingCost}
                        canContinue={canContinueFromShipping}
                    />
                </div>
            )}
        </div>
    )
}

export default CartScreen
