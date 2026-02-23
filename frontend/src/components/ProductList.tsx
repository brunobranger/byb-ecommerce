import { useCart } from '../hooks/useCart'

const ProductList = () => {
    const { cartItems, removeItem, updateQuantity } = useCart()

    return (
        <div className="flex flex-col gap-4">
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
                            {/* Botón Eliminar */}
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

                            {/* Counter */}
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
    )
}

export default ProductList
