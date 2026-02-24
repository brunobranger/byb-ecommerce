import type { PaymentMethodId } from '../types/paymentMethod'
import type { Carrier } from '../types/carrier'

// Datos bancarios para depósito (hardcodeados por ahora)
const bankDetails = {
    bank: 'Banco Galicia',
    accountType: 'Cuenta Corriente',
    cbu: '0070999130000123456789',
    alias: 'TIENDA.TECH.PAGOS',
    holder: 'Tech Store S.R.L.',
    cuit: '30-12345678-9',
}

const paymentLabels: Record<PaymentMethodId, string> = {
    cash: 'Efectivo / Transferencia',
    bank_deposit: 'Depósito bancario',
    credit_card: 'Tarjeta de crédito',
    mercado_pago: 'Mercado Pago',
}

type ShippingOption = 'pickup' | 'delivery' | null

interface BillingProps {
    // Productos
    cartItems: {
        id: string
        name: string
        imageUrl?: string
        price: number
        priceList: number
        quantity: number
    }[]
    // Envío
    shippingOption: ShippingOption
    selectedCarrier: Carrier | null
    shippingCost: number | null
    // Dirección (si es delivery)
    deliveryAddress: {
        street: string
        city: string
        zip: string
        name: string
        phone: string
    } | null
    // Pago
    paymentMethod: PaymentMethodId
    // Totales
    subtotal: number
    total: number
    // Acción
    onConfirm: () => void
    onBack: () => void
}

const Billing = ({
    cartItems,
    shippingOption,
    selectedCarrier,
    shippingCost,
    deliveryAddress,
    paymentMethod,
    subtotal,
    total,
    onConfirm,
    onBack,
}: BillingProps) => {
    return (
        <div className="flex flex-col gap-6">
            {/* Productos */}
            <section className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
                <p className="text-xs text-gray-400 uppercase tracking-widest">Productos</p>
                {cartItems.map(item => (
                    <div key={item.id} className="flex items-center gap-4">
                        {item.imageUrl && (
                            <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-14 h-14 object-contain shrink-0"
                            />
                        )}
                        <div className="flex-1">
                            <p className="text-sm font-medium text-black leading-tight">
                                {item.name}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                                {item.quantity} unidad{item.quantity > 1 ? 'es' : ''}
                            </p>
                        </div>
                        <span className="text-sm font-bold text-black whitespace-nowrap">
                            $ {(item.price * item.quantity).toLocaleString()}
                        </span>
                    </div>
                ))}
            </section>

            {/* Envío */}
            <section className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-3 shadow-sm">
                <p className="text-xs text-gray-400 uppercase tracking-widest">Envío</p>
                {shippingOption === 'pickup' ? (
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-black">Retiro en el local</span>
                        <span className="text-sm font-semibold text-blue-600">Gratis</span>
                    </div>
                ) : (
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-black">Envío a domicilio</p>
                            {selectedCarrier && (
                                <p className="text-xs text-gray-400 mt-0.5">
                                    via {selectedCarrier.name}
                                </p>
                            )}
                            {deliveryAddress && (
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {deliveryAddress.street}, {deliveryAddress.city}
                                </p>
                            )}
                        </div>
                        <span className="text-sm font-semibold text-black">
                            $ {shippingCost?.toLocaleString()}
                        </span>
                    </div>
                )}
            </section>

            {/* Método de pago + datos bancarios si aplica */}
            <section className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-3 shadow-sm">
                <p className="text-xs text-gray-400 uppercase tracking-widest">Método de pago</p>
                <p className="text-sm font-semibold text-black">{paymentLabels[paymentMethod]}</p>

                {/* Datos bancarios para depósito */}
                {paymentMethod === 'bank_deposit' && (
                    <div className="flex flex-col gap-2 bg-gray-50 rounded-xl p-4 text-sm mt-1">
                        {Object.entries({
                            Banco: bankDetails.bank,
                            'Tipo de cuenta': bankDetails.accountType,
                            Titular: bankDetails.holder,
                            CUIT: bankDetails.cuit,
                            CBU: bankDetails.cbu,
                            Alias: bankDetails.alias,
                        }).map(([label, value], i, arr) => (
                            <div key={label}>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">{label}</span>
                                    <span
                                        className={`font-semibold text-black ${label === 'CBU' ? 'font-mono text-xs' : ''}`}
                                    >
                                        {value}
                                    </span>
                                </div>
                                {i < arr.length - 1 && <hr className="border-gray-200 mt-2" />}
                            </div>
                        ))}
                    </div>
                )}

                {/* Info para efectivo/transferencia */}
                {paymentMethod === 'cash' && (
                    <p className="text-xs text-gray-400">
                        Te enviaremos los datos para la transferencia o el código de pago por
                        Rapipago al confirmar el pedido.
                    </p>
                )}
            </section>

            {/* Total */}
            <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Subtotal</span>
                    <span className="text-sm font-semibold text-black">
                        $ {subtotal.toLocaleString()}
                    </span>
                </div>
                {shippingCost !== null && shippingCost > 0 && (
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-gray-500">Envío</span>
                        <span className="text-sm font-semibold text-black">
                            $ {shippingCost.toLocaleString()}
                        </span>
                    </div>
                )}
                <hr className="border-gray-100 mb-4" />
                <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-black">Total</span>
                    <span className="text-2xl font-bold text-blue-900">
                        $ {total.toLocaleString()}
                    </span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1 text-right">
                    *Precio abonando con depósito o transferencia.
                </p>
            </section>

            {/* Acciones */}
            <div className="flex flex-col gap-3">
                <button
                    type="button"
                    onClick={onConfirm}
                    className="w-full bg-blue-900 hover:bg-blue-800 py-4 rounded-xl font-bold uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-blue-950/50 text-white"
                >
                    Realizar compra
                </button>
                <button
                    type="button"
                    onClick={onBack}
                    className="w-full py-3 rounded-xl border border-blue-900 text-blue-900 font-bold hover:bg-blue-900/10 transition-colors text-center text-sm"
                >
                    Anterior
                </button>
            </div>
        </div>
    )
}

export default Billing
