import { Link } from 'react-router'
import { useCart } from '../hooks/useCart' // Importamos el hook

const CartScreen = () => {
    // Extraemos todo lo necesario del Contexto
    const { cartItems, removeItem, updateQuantity } = useCart()

    const isEmpty = cartItems.length === 0
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

    return (
        <div className="w-full max-w-7xl mx-auto py-12 px-4">
            {/* Header con tu estilo de flecha y título */}
            <div className="flex items-center gap-4 mb-2">
                <Link to="/" className="text-blue-600 hover:text-blue-500 transition-colors">
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
                <h2 className="text-3xl font-bold tracking-tight">Mi carrito</h2>
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
                    {/* LISTADO DE PRODUCTOS */}
                    <div className="lg:col-span-8 flex flex-col gap-4">
                        {cartItems.map(item => (
                            <div
                                key={item.id}
                                className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-xl"
                            >
                                {/* Imagen */}
                                <div className="w-32 h-32 shrink-0">
                                    <img
                                        src={item.imageUrl}
                                        className="w-full h-full object-contain"
                                        alt={item.name}
                                    />
                                </div>

                                {/* Info Central */}
                                <div className="flex-1">
                                    <h3 className="text-base md:text-lg font-medium text-black leading-tight pr-10">
                                        {item.name}
                                    </h3>

                                    <div className="flex items-center gap-3 mt-4">
                                        {/* Botón Eliminar - Conectado a removeItem */}
                                        <button
                                            type="button"
                                            onClick={() => removeItem(item.id)}
                                            className="border border-blue-900 text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={2}
                                                stroke="currentColor"
                                                className="w-5 h-5"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                                />
                                            </svg>
                                        </button>

                                        {/* Counter - Conectado a updateQuantity */}
                                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden h-10">
                                            <button
                                                type="button"
                                                onClick={() => updateQuantity(item.id, 'dec')}
                                                className="px-3 text-gray-400 hover:bg-gray-100"
                                            >
                                                -
                                            </button>
                                            <div className="px-4 font-bold text-sm text-black border-x border-gray-200">
                                                {item.quantity}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => updateQuantity(item.id, 'inc')}
                                                className="px-3 text-blue-900 font-bold hover:bg-blue-50"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Precio */}
                                <div className="text-right">
                                    <span className="text-xl font-bold text-black whitespace-nowrap">
                                        $ {item.price.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* RESUMEN */}
                    <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-3xl p-8 sticky top-24 backdrop-blur-md">
                        <h2 className="text-xl font-bold uppercase tracking-tight mb-6">Resumen</h2>

                        <ul className="space-y-4 mb-6">
                            <li className="flex justify-between items-center">
                                <span>
                                    {cartItems.length}{' '}
                                    {cartItems.length === 1 ? 'producto' : 'productos'}
                                </span>
                                <span className="font-bold">$ {subtotal.toLocaleString()}</span>
                            </li>

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
                                $ {subtotal.toLocaleString()}*
                            </span>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                type="button"
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
                        </div>

                        <p className="text-[10px] text-gray-500 mt-4 text-center">
                            *Precio abonando con depósito o transferencia.
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CartScreen
