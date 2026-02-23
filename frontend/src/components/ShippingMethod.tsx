import type { Carrier } from '../types/carrier'

type ShippingOption = 'pickup' | 'delivery' | null

// Métodos de envío a domicilio (hardcodeados por ahora)
const shippingCarriers: Carrier[] = [
    { id: 'oca', name: 'OCA', price: 4956 },
    { id: 'andreani', name: 'Andreani', price: 5100 },
]

// Datos del local (hardcodeados por ahora, no tengo definido si van a ser estos)
const storeInfo = {
    address: 'Av. Corrientes 1234, CABA',
    hours: 'Lunes a Viernes de 10:00 a 19:00 hs / Sábados de 10:00 a 14:00 hs',
}

// Dirección del usuario (vendría del perfil/cuenta, pero todavia no lo tengo en types ni cree el Account.tsx)
const userAddress = {
    street: 'Av. Santa Fe 3456 2°B',
    city: 'Palermo - Buenos Aires',
    zip: '1425',
    name: 'Juan Pérez',
    phone: '1155556666',
}

interface ShippingMethodProps {
    selected: ShippingOption
    onSelect: (option: ShippingOption) => void
    selectedCarrier: string | null
    onSelectCarrier: (carrierId: string) => void
}

const ShippingMethod = ({
    selected,
    onSelect,
    selectedCarrier,
    onSelectCarrier,
}: ShippingMethodProps) => {
    return (
        <div className="flex flex-col gap-4">
            {/* Envío a domicilio */}
            <div
                className={`bg-white border rounded-2xl shadow-sm transition-all overflow-hidden
                    ${selected === 'delivery' ? 'border-blue-900 ring-2 ring-blue-900/20' : 'border-gray-200'}`}
            >
                {/* Cabecera clickeable */}
                <button
                    type="button"
                    onClick={() => onSelect('delivery')}
                    className="w-full flex items-center justify-between p-6 text-left"
                >
                    <div className="flex items-center gap-4">
                        {/* Radio custom */}
                        <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0
                            ${selected === 'delivery' ? 'border-blue-900' : 'border-gray-300'}`}
                        >
                            {selected === 'delivery' && (
                                <div className="w-2.5 h-2.5 rounded-full bg-blue-900" />
                            )}
                        </div>
                        <span className="text-base font-semibold text-black uppercase tracking-wide">
                            Envío a domicilio
                        </span>
                    </div>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className={`w-5 h-5 text-blue-900 transition-transform ${selected === 'delivery' ? 'rotate-90' : ''}`}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m8.25 4.5 7.5 7.5-7.5 7.5"
                        />
                    </svg>
                </button>

                {/* Detalle expandido */}
                {selected === 'delivery' && (
                    <div className="px-6 pb-6 flex flex-col gap-5 border-t border-gray-100 pt-5">
                        {/* Dirección guardada */}
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">
                                Dirección personal
                            </p>
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="font-semibold text-black">{userAddress.street}</p>
                                    <p className="text-sm text-gray-600">
                                        {userAddress.city} · CP:{' '}
                                        <span className="font-semibold">{userAddress.zip}</span>
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Recibe: {userAddress.name} · Tel: {userAddress.phone}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    className="text-blue-600 text-sm font-semibold hover:text-blue-500 transition-colors whitespace-nowrap"
                                >
                                    Cambiar
                                </button>
                            </div>
                        </div>

                        {/* Métodos de envío */}
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">
                                Seleccioná el método de envío
                            </p>
                            <div className="flex flex-col gap-2">
                                {shippingCarriers.map((carrier, index) => (
                                    <div key={carrier.id}>
                                        <button
                                            type="button"
                                            onClick={() => onSelectCarrier(carrier.id)}
                                            className="w-full flex items-center justify-between py-3 px-1 hover:bg-gray-50 rounded-lg transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0
                                                    ${selectedCarrier === carrier.id ? 'border-blue-900' : 'border-gray-300'}`}
                                                >
                                                    {selectedCarrier === carrier.id && (
                                                        <div className="w-2.5 h-2.5 rounded-full bg-blue-900" />
                                                    )}
                                                </div>
                                                <span className="text-sm font-medium text-black">
                                                    {carrier.name}
                                                </span>
                                            </div>
                                            <span className="text-sm font-semibold text-black">
                                                $ {carrier.price.toLocaleString()}
                                            </span>
                                        </button>
                                        {index < shippingCarriers.length - 1 && (
                                            <hr className="border-gray-100" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Retiro en el local */}
            <div
                className={`bg-white border rounded-2xl shadow-sm transition-all overflow-hidden
                    ${selected === 'pickup' ? 'border-blue-900 ring-2 ring-blue-900/20' : 'border-gray-200'}`}
            >
                {/* Cabecera clickeable */}
                <button
                    type="button"
                    onClick={() => onSelect('pickup')}
                    className="w-full flex items-center justify-between p-6 text-left"
                >
                    <div className="flex items-center gap-4">
                        <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0
                            ${selected === 'pickup' ? 'border-blue-900' : 'border-gray-300'}`}
                        >
                            {selected === 'pickup' && (
                                <div className="w-2.5 h-2.5 rounded-full bg-blue-900" />
                            )}
                        </div>
                        <span className="text-base font-semibold text-black uppercase tracking-wide">
                            Retiro en el local
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-blue-600">Gratis</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                            className={`w-5 h-5 text-blue-900 transition-transform ${selected === 'pickup' ? 'rotate-90' : ''}`}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m8.25 4.5 7.5 7.5-7.5 7.5"
                            />
                        </svg>
                    </div>
                </button>

                {/* Detalle expandido */}
                {selected === 'pickup' && (
                    <div className="px-6 pb-6 flex flex-col gap-3 border-t border-gray-100 pt-5">
                        <div className="flex items-start gap-3">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-5 h-5 text-blue-900 shrink-0 mt-0.5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                                />
                            </svg>
                            <div>
                                <p className="font-semibold text-black">{storeInfo.address}</p>
                                <p className="text-sm text-gray-500 mt-1">{storeInfo.hours}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ShippingMethod
