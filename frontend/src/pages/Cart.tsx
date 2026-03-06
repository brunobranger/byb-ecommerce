import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router'
import { useCart } from '../hooks/useCart'
import ProductList from '../components/ProductList'
import OrderSummary from '../components/OrderSummary'
import ShippingMethod from '../components/ShippingMethod'
import PaymentMethod from '../components/PaymentMethod'
import CreditCardForm from '../components/CreditCardForm'
import Billing from '../components/Billing'
import OrderConfirmation from '../components/OrderConfirmation'
import { shippingCarriers } from '../data/shippingCarriers'
import { calculateSubtotal } from '../utils/priceUtils'
import type { PaymentMethodId } from '../types/paymentMethod'
import { orderService } from '../services/orderService'

import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router'

type Step = 'cart' | 'shipping' | 'payment' | 'credit_card' | 'billing' | 'confirmation'
type ShippingOption = 'pickup' | 'delivery' | null

// Steps válidos — para validar que nadie entre con un ?step=cualquiercosa en la URL
const VALID_STEPS: Step[] = [
    'cart',
    'shipping',
    'payment',
    'credit_card',
    'billing',
    'confirmation',
]

// Orden de los pasos para realizar el proceso de compra (y para modificar la URL en base a eso)
const STEP_ORDER: Record<Step, number> = {
    cart: 0,
    shipping: 1,
    payment: 2,
    credit_card: 3,
    billing: 4,
    confirmation: 5,
}

// Dirección del usuario (vendría del perfil/cuenta)
const userAddress = {
    street: 'Av. Santa Fe 3456 2°B',
    city: 'Palermo - Buenos Aires',
    zip: '1425',
    name: 'Juan Pérez',
    phone: '1155556666',
}

const CartScreen = () => {
    const { cartItems, clearCart } = useCart()

    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()

    const [searchParams, setSearchParams] = useSearchParams()
    const [shippingOption, setShippingOption] = useState<ShippingOption>(null)
    const [selectedCarrier, setSelectedCarrier] = useState<string | null>(null)
    const [selectedPayment, setSelectedPayment] = useState<PaymentMethodId | null>(null)
    const [cardValid, setCardValid] = useState(false)
    const [installmentDelta, setInstallmentDelta] = useState(0) // Delta de la cuota elegida — negativo, cero o positivo, siempre sobre priceList
    const [orderSuccess, setOrderSuccess] = useState<boolean | null>(null)
    const [orderNumber, setOrderNumber] = useState('') // Número de orden simulado
    const rawStep = searchParams.get('step') as Step | null
    const step: Step = rawStep && VALID_STEPS.includes(rawStep) ? rawStep : 'cart' // Leemos el step desde la URL — si no existe o no es válido, usamos 'cart'

    // Funcion para cambiar el step — actualiza la URL en lugar del estado
    const setStep = (nextStep: Step) => {
        if (nextStep === 'cart') {
            // En cart limpiamos el query param para tener la URL más limpia: /carrito
            setSearchParams({})
        } else {
            setSearchParams({ step: nextStep })
        }
    }

    const isEmpty = cartItems.length === 0

    // Guards — evitan que el usuario llegue a un step sin haber completado los anteriores
    useEffect(() => {
        // Si el carrito está vacío no puede estar en ningún step avanzado
        if (isEmpty && step !== 'cart') {
            setStep('cart')
            return
        }

        // Si está en payment o más adelante pero no eligió envío, lo mandamos a shipping
        if (STEP_ORDER[step] >= STEP_ORDER['payment'] && shippingOption === null) {
            setStep('shipping')
            return
        }

        // Si está en billing o más adelante pero no eligió método de pago, lo mandamos a payment
        if (STEP_ORDER[step] >= STEP_ORDER['billing'] && selectedPayment === null) {
            setStep('payment')
            return
        }

        // Si está en credit_card pero el método elegido no es tarjeta, lo mandamos a payment
        if (step === 'credit_card' && selectedPayment !== 'credit_card') {
            setStep('payment')
            return
        }

        // Si está en confirmation pero no hay resultado de orden, algo raro pasó
        if (step === 'confirmation' && orderSuccess === null) {
            setStep('cart')
            return
        }
    }, [step, isEmpty, shippingOption, selectedPayment, orderSuccess])

    // Calculamos el costo de envío según el carrier seleccionado
    const shippingCost =
        shippingOption === 'delivery'
            ? (shippingCarriers.find(c => c.id === selectedCarrier)?.price ?? null)
            : shippingOption === 'pickup'
              ? 0
              : null

    // Subtotal y total — lo deje en priceUtils para evitar lógica duplicada o acumulativa
    const subtotal = calculateSubtotal(cartItems, selectedPayment, installmentDelta)
    const total = subtotal + (shippingCost ?? 0)

    const canContinueFromShipping =
        shippingOption === 'pickup' || (shippingOption === 'delivery' && selectedCarrier !== null)

    const canContinue =
        step === 'shipping'
            ? canContinueFromShipping
            : step === 'payment'
              ? selectedPayment !== null
              : step === 'credit_card'
                ? cardValid
                : true

    const stepConfig: Record<Step, { title: string; backTo: string | null }> = {
        cart: { title: 'Mi carrito', backTo: '/' },
        shipping: { title: 'Elegí la forma de entrega', backTo: null },
        payment: { title: 'Elegí el método de pago', backTo: null },
        credit_card: { title: 'Datos de la tarjeta', backTo: null },
        billing: { title: 'Revisá tu pedido', backTo: null },
        confirmation: { title: orderSuccess ? '¡Listo!' : 'Ups...', backTo: null },
    }

    const { title, backTo } = stepConfig[step]

    const handleBack = () => {
        if (step === 'shipping') setStep('cart')
        if (step === 'payment') setStep('shipping')
        if (step === 'credit_card') setStep('payment')
        if (step === 'billing')
            setStep(selectedPayment === 'credit_card' ? 'credit_card' : 'payment')
    }

    const handleNext = () => {
        if (step === 'cart') {
            if (!isAuthenticated) {
                navigate('/ingresar', { state: { from: '/carrito' } })
                return
            }
            setStep('shipping')
        }
        if (step === 'shipping') setStep('payment')
        if (step === 'payment')
            selectedPayment === 'credit_card' ? setStep('credit_card') : setStep('billing')
        if (step === 'credit_card') setStep('billing')
    }

    const handleConfirmOrder = async () => {
        try {
            const order = await orderService.createOrder({
                shippingOption: shippingOption!,
                carrier: selectedCarrier ?? undefined,
                shippingCost: shippingCost ?? 0,
                deliveryAddress: shippingOption === 'delivery' ? userAddress : undefined,
                paymentMethod: selectedPayment!,
                subtotal,
                total,
            })
            await clearCart()
            setOrderNumber(order.orderNumber)
            setOrderSuccess(true)
            setStep('confirmation')
        } catch (error) {
            setOrderSuccess(false)
            setStep('confirmation')
        }
    }

    const selectedCarrierObj = shippingCarriers.find(c => c.id === selectedCarrier) ?? null

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
                ) : step !== 'confirmation' ? (
                    <button
                        type="button"
                        onClick={handleBack}
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
                ) : null}
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
            ) : step === 'confirmation' ? (
                /* Confirmación — pantalla completa, sin resumen lateral */
                <OrderConfirmation
                    success={orderSuccess ?? false}
                    paymentMethod={selectedPayment!}
                    orderNumber={orderNumber}
                    onRetry={() => setStep('credit_card')}
                />
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
                        {step === 'credit_card' && (
                            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                                <CreditCardForm
                                    onDataChange={(_data, isValid, delta) => {
                                        setCardValid(isValid)
                                        setInstallmentDelta(delta)
                                    }}
                                />
                            </div>
                        )}
                        {step === 'billing' && (
                            <Billing
                                cartItems={cartItems}
                                shippingOption={shippingOption}
                                selectedCarrier={selectedCarrierObj}
                                shippingCost={shippingCost}
                                deliveryAddress={shippingOption === 'delivery' ? userAddress : null}
                                paymentMethod={selectedPayment!}
                                subtotal={subtotal}
                                total={total}
                                onConfirm={handleConfirmOrder}
                                onBack={handleBack}
                            />
                        )}
                    </div>

                    {/* RESUMEN — siempre visible excepto en billing (que tiene el suyo propio) */}
                    {step !== 'billing' && (
                        <OrderSummary
                            step={step}
                            onNext={handleNext}
                            onBack={handleBack}
                            subtotal={subtotal}
                            total={total}
                            shippingCost={shippingCost}
                            canContinue={canContinue}
                        />
                    )}
                </div>
            )}
        </div>
    )
}

export default CartScreen
